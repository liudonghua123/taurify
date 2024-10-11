import { Options } from './options.js';
import { execPipeOutput, execWithOutput, spinnerText } from './utils.js';
import { resolve } from 'path';
import { readFile, writeFile, cp } from 'fs/promises';

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

    // initialize tauri app
    await spinnerText('Initializing Tauri app', async () =>
      execWithOutput(`npm install`, {
        cwd: tauriAppDir,
      }),
    );

    // update icon of tauri app
    await spinnerText('Updating icon', async () =>
      execWithOutput(`npm run tauri icon --i ${icon}`, {
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
      tauriConf.productName = productName;
      tauriConf.identifier = identifier;
      tauriConf.version = version;
      await writeFile(
        resolve(tauriAppDir, 'src-tauri/tauri.conf.json'),
        JSON.stringify(tauriConf, null, 2),
      );
    });

    let buildCommand = `npm run tauri -- build`;
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
      // TODO: handle bundles like msi/nsis on Windows, deb/rpm on Linux, and dmg on macOS
      const buildBinary =
        process.platform === 'win32' ? `${productName}.exe` : productName;
      await cp(
        `${resolve(tauriAppDir, 'src-tauri/target/release', buildBinary)}`,
        `${outputDir}`,
      );
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
