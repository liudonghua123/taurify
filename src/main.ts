#!/usr/bin/env node

import { Command } from 'commander';
import { taurify } from './index.js';
import { defaultOptions, Options } from './options.js';
import ora from 'ora';
import fs from 'fs';
import { resolve, extname, join } from 'path';

const program = new Command();

program
  .version('1.0.0')
  .option('-v, --verbose', 'Enable verbose output', defaultOptions.verbose)
  .option(
    '-i, --icon <path>',
    'Path to the source icon (squared PNG or SVG file with transparency)',
    defaultOptions.icon,
  )
  .option(
    '-b, --bundles <bundles>',
    'Space or comma separated list of bundles to package.',
  )
  .option(
    '-p, --product-name <name>',
    'Name of the app',
    defaultOptions.productName,
  )
  .option(
    '--identifier <identifier>',
    'Identifier of the app',
    defaultOptions.identifier,
  )
  .option(
    '-o, --output-dir <path>',
    'Output directory',
    defaultOptions.outputDir,
  )
  .option(
    '-c, --config <config>',
    'JSON string or path to JSON file to merge with tauri.conf.json',
  )
  .argument('<html-app-directory>', 'Path to the HTML app directory')
  .action(async (htmlAppDirectory, options: Options) => {
    // check whether html-app-directory exists
    if (!fs.existsSync(htmlAppDirectory)) {
      console.error(`Error: The directory ${htmlAppDirectory} does not exist.`);
      process.exit(1);
    }
    // check whether html-app-directory contains an index.html file
    if (!fs.existsSync(join(htmlAppDirectory, 'index.html'))) {
      console.error(
        `Error: The file index.html does not exist in the directory ${htmlAppDirectory}.`,
      );
      process.exit(1);
    }
    // check whether the icon file exists and the file extension is png or svg
    if (
      !fs.existsSync(options.icon) ||
      !['.png', '.svg'].includes(extname(options.icon))
    ) {
      console.error(
        `Error: The file ${options.icon} does not exist or is not squared PNG or SVG file with transparency`,
      );
      process.exit(1);
    }
    // Create output directory if it does not exist
    if (!fs.existsSync(options.outputDir)) {
      fs.mkdirSync(options.outputDir, { recursive: true });
    }

    // Overwrite the product-name, identifier, according to the html-app-directory name
    // Replace space, underscore, and hyphen with a single hyphen
    const productName = htmlAppDirectory
      .split('/')
      .pop()
      .replace(/[_ -]+/g, '-');
    options.productName = productName;
    options.identifier = `com.${productName}.app`;

    // Normalize the frontendDist path
    options.frontendDist = resolve(htmlAppDirectory);
    // Normalize the outputDir path
    options.outputDir = resolve(options.outputDir);

    const spinner = ora('Building...').start();
    await taurify(options);
    spinner.succeed('Build completed successfully.');
  });

program.parse(process.argv);
