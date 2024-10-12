# taurify

Package HTML-based app via Tauri v2, supporting Windows, macOS, Linux, Android, and iOS.

## Introduction

`taurify` is a tool to package HTML-based applications using Tauri v2. It supports multiple platforms including Windows, macOS, Linux, Android, and iOS.

## Usage

### Installation

To install `taurify`, you need to have Node.js (>= 22) installed. You can install `taurify` using npm:

```sh
npm install -g @liudonghua123/taurify
```

### Running

To package your HTML-based app, you can use the following command:

```sh
taurify <path-to-html-app> [options]
```

#### Options

- `-v, --version`: Version of the package app (default: `1.0.0`)
- `--verbose`: Enable verbose output
- `-i, --icon <path>`: Path to the source icon (squared PNG or SVG file with transparency)
- `-b, --bundles <bundles>`: Space or comma-separated list of bundles to package.
- `-p, --product-name <name>`: Name of the app
- `--identifier <identifier>`: Identifier of the app
- `-o, --output-dir <path>`: Output directory (default: `.`)
- `-c, --config <config>`: JSON string or path to JSON file to merge with `tauri.conf.json`

### Example

```sh
taurify ./my-html-app -i ./icon.png -p myapp --identifier com.myapp.app -o ./output
```

## Contribution

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the Apache-2.0 License. See the LICENSE file for details.
