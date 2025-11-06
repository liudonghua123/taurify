#!/usr/bin/env node

import { Command } from 'commander';
import { taurify } from './index.js';
import { defaultOptions, Options } from './options.js';
import fs from 'fs';
import { resolve, extname, join } from 'path';
import { isValidUrl } from './utils.js';

const program = new Command();

program
  .option('-v, --version', 'Version of the package app', defaultOptions.version)
  .option('--verbose', 'Enable verbose output', defaultOptions.verbose)
  .option('--debug', 'Build with debug mode', defaultOptions.debug)
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
  .argument('app', 'Path to the HTML app directory or the url to the app')
  .action(async (app, options: Options) => {
    let productName = '';
    // Check whether the app is a URL
    if (isValidUrl(app)) {
      productName = new URL(app).hostname.replace(/\./g, '-');
    } else {
      // check whether the app directory exists and contains an index.html file
      if (!fs.existsSync(app) || !fs.existsSync(join(app, 'index.html'))) {
        console.error(
          `Error: The directory ${app} does not exist or does not contain an index.html file.`,
        );
        process.exit(1);
      }
      productName = app
        .split('/')
        .pop()
        .replace(/[_ -]+/g, '-');
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

    // Overwrite the product-name, identifier, according to the app name
    // Replace space, underscore, and hyphen with a single hyphen
    options.productName ??= productName;
    options.identifier ??= `com.${productName}.app`;
    options.frontendDist = app;
    // normalize the icon path
    options.icon = resolve(options.icon);
    // normalize the config path
    options.config = resolve(options.config);
    // Normalize the outputDir path
    options.outputDir = resolve(options.outputDir);

    console.info('Building...');
    await taurify(options);
  });

program.parse(process.argv);
