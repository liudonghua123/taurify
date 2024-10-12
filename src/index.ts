import { Options } from './options.js';
import { execPipeOutput, execWithOutput, spinnerText } from './utils.js';
import { basename, resolve } from 'path';
import { readFile, writeFile, cp, symlink, rm } from 'fs/promises';
import { existsSync } from 'fs';

export async function taurify({
  productName,
  identifier,
  version,
  frontendDist,
  outputDir,
  icon,
  tauriConfJson,
  verbose,
  bundles,
}: Options) {
  try {
    // resolve the tauri app directory
    const tauriAppDir = resolve(import.meta.dirname, '..', 'tauri-app');
    // resolve the npm command
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    // initialize tauri app
    await spinnerText('Initializing Tauri app', async () =>
      execWithOutput(`${npmCommand} install`, {
        cwd: tauriAppDir,
      }),
    );

    // update icon of tauri app
    await spinnerText('Updating icon', async () =>
      execWithOutput(`${npmCommand} run tauri icon --i ${icon}`, {
        cwd: tauriAppDir,
      }),
    );

    // update build.frontendDist of tauri.conf.json
    await spinnerText('Updating tauri.conf.json', async () => {
      const tauriConfJson = await readFile(
        resolve(tauriAppDir, 'src-tauri/tauri.conf.json'),
        'utf-8',
      );
      const tauriConf = JSON.parse(tauriConfJson);
      tauriConf.build.frontendDist = frontendDist;
      // if the frontendDist is directory, it should be relative to the tauri app directory, otherwise it should be a URL
      // create ../dist link to the frontendDist directory if it is a directory
      if (!frontendDist.includes('://')) {
        const distLink = resolve(tauriAppDir, 'dist');
        // remove the existing ../dist force even it is not a symlink or does not exist
        await rm(distLink, { recursive: true, force: true });
        // create symlink to the frontendDist directory
        await symlink(resolve(frontendDist), distLink, 'dir');
        tauriConf.build.frontendDist = '../dist';
      }
      tauriConf.productName = productName;
      tauriConf.identifier = identifier;
      tauriConf.version = version;
      // https://v2.tauri.app/reference/config/#mainbinaryname
      tauriConf.mainBinaryName = productName;
      await writeFile(
        resolve(tauriAppDir, 'src-tauri/tauri.conf.json'),
        JSON.stringify(tauriConf, null, 2),
      );
    });

    let buildCommand = `${npmCommand} run tauri -- build`;
    if (tauriConfJson) buildCommand += ` --config ${tauriConfJson}`;
    if (verbose) buildCommand += ` --verbose`;
    if (bundles) buildCommand += ` --bundles ${bundles}`;
    if (verbose) {
      await execPipeOutput(buildCommand, { cwd: tauriAppDir });
    } else {
      // build the tauri app
      await spinnerText('Building Tauri app', async () => {
        await execWithOutput(buildCommand, { cwd: tauriAppDir });
      });
    }

    // copy the built app to the output directory
    await spinnerText('Copying built app', async () => {
      // the build binary is located in src-tauri/target/release/${productName}, with .exe extension on Windows
      const buildBinary =
        process.platform === 'win32' ? `${productName}.exe` : productName;
      spinnerText(
        {text: `Copying ${buildBinary} to ${outputDir}`, indent: 4},
        async () =>
          await await cp(
            `${resolve(tauriAppDir, 'src-tauri/target/release', buildBinary)}`,
            `${outputDir}/${buildBinary}`,
          ),
      );
      // handle bundles like msi/nsis on Windows, deb/rpm on Linux, and dmg on macOS
      const getPossibleBundles = (os) => {
        const arch = {
          win32: {
            ia32: 'x86',
            x64: 'x64',
            arm64: 'arm64',
          },
          linux: {
            ia32: 'i386',
            x64: 'amd64',
            arm: 'armhf',
            arm64: 'arm64',
          },
          darwin: {
            x64: 'x64',
            arm64: 'aarch64',
          },
        }[process.platform][process.arch];
        switch (os) {
          case 'win32':
            return [
              `${resolve(tauriAppDir, 'src-tauri/target/release/bundle/msi/', `${productName}_${version}_${arch}_en-US.msi`)}`,
              `${resolve(tauriAppDir, 'src-tauri/target/release/bundle/nsis/', `${productName}_${version}_${arch}-setup.exe`)}`,
            ];
          case 'linux':
            // eslint-disable-next-line no-case-declarations
            const rpmArch = {
              ia32: 'i386',
              x64: 'x86_64',
              arm: 'armhfp',
              arm64: 'aarch64',
            }[process.arch];
            return [
              `${resolve(tauriAppDir, 'src-tauri/target/release/bundle/deb/', `${productName}_${version}_${arch}.deb`)}`,
              `${resolve(tauriAppDir, 'src-tauri/target/release/bundle/rpm/', `${productName}_${version}-1.${rpmArch}.rpm`)}`,
              `${resolve(tauriAppDir, 'src-tauri/target/release/bundle/appimage/', `${productName}_${version}_${arch}.AppImage`)}`,
            ];
          case 'darwin':
            return [
              `${resolve(tauriAppDir, 'src-tauri/target/release/bundle/dmg/', `${productName}_${version}_${arch}.dmg`)}`,
            ];
          default:
            return [];
        }
      };
      const possibleBundles = getPossibleBundles(process.platform);
      for (const bundle of possibleBundles) {
        if (existsSync(bundle)) {
          spinnerText(
            {text: `Copying ${basename(bundle)} to ${outputDir}`, indent: 4},
            async () => await cp(bundle, `${outputDir}/${basename(bundle)}`),
          );
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
