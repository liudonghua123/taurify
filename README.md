# Taurify

Package HTML-based applications using Tauri v2, with support for Windows, macOS, Linux, Android, and iOS.

## Introduction

`Taurify` is a cross-platform tool designed to help developers package HTML-based applications into native executables using the [Tauri](https://tauri.app/) framework. With `Taurify`, your web application can run on multiple platforms including **Windows**, **macOS**, **Linux**, **Android**, and **iOS**, while maintaining a lightweight footprint and ensuring performance.

The tool offers flexibility and customization by allowing developers to modify Tauri project files located in the application directory. On Windows, this can be found at `%APPDATA%\npm\node_modules\@liudonghua123\taurify\tauri-app`. Similar methods are available for macOS and Linux users. 

### Key Benefits

- **Lightweight and Secure**: Unlike traditional Electron apps, `Taurify` uses system-native webviews, resulting in smaller binary sizes and reduced memory consumption.
- **Customizable**: Developers have complete control over the Tauri project files, allowing for deep customization.
- **Cross-Platform Support**: Package apps for desktop platforms (Windows, macOS, Linux) as well as mobile platforms (Android, iOS).

> **Note:** This project is under active development, with ongoing bug fixes and new features arriving soon. Contributions are welcome!

## Prerequisites

Before using `Taurify`, ensure the following dependencies are installed on your system:

- **[Node.js](https://nodejs.org/)** (version 22 or higher)
- **[Rust](https://rustup.rs/)** (to compile the Tauri app)
- Any additional dependencies listed in the [Tauri Prerequisites](https://tauri.app/start/prerequisites/) (e.g., system packages required for your platform)

Ensure that your system meets the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for building applications. These may include specific tools or libraries required for different platforms like Xcode for macOS or Webview2 for Windows.

## Installation

You can install `Taurify` globally using `npm`:

```bash
npm install -g @liudonghua123/taurify
```

After installation, you will have access to the `taurify` command, which you can use to package your HTML-based applications.

## Usage

Once installed, `Taurify` allows you to package your HTML app using a simple command-line interface.

### Basic Command

To package your HTML-based app, run the following command:

```bash
taurify <path-to-html-app> [options]
```

- `<path-to-html-app>`: Path to the root directory of your HTML project which contains `index.html` or the url you to package (e.g., `./my-app` or `https://github.com`).

### Command Options

- `-i, --icon <path>`: Path to the app icon. The icon should be a squared PNG or SVG file with transparency.
- `-p, --product-name <name>`: Sets the name of the packaged app (e.g., `tauri-app`).
- `-o, --output-dir <path>`: Directory to place the generated files (default: `.`).
- `-c, --config <config>`: A JSON string or path to a JSON file to merge with the default `tauri.conf.json`.
- `-b, --bundles <bundles>`: Space- or comma-separated list of bundles to package (e.g., `deb`, `appimage`, `msi`, `dmg`).
- `--identifier <identifier>`: The unique identifier for your application (e.g., `com.tauri-app.app`).
- `-v, --version <version>`: The version number of the app (default: `1.0.0`).
- `--verbose`: Enables verbose logging to assist with debugging or output details.
- `--debug`: Build the app in debug mode instead of release mode. Debug builds are faster to compile but produce larger binaries without optimizations.

### Example

Here is an example of how to package an HTML app with a custom icon and app name:

```bash
taurify ./my-html-app -i ./icon.png -p my-html-app --identifier com.my-html-app.app -o .
```

This command will package the app located in `./my-html-app`, using the specified icon and product name, and output the result to the `.` directory.

## Features

- **Cross-Platform Packaging**: Package your app for desktop and mobile platforms with one tool.
- **Tauri v2 Integration**: Leverage Tauri v2's new features and improvements for faster, smaller, and more secure apps.
- **Customizable Project Files**: Modify and extend the Tauri project to suit your specific needs.
- **Active Development**: New features and bug fixes are regularly added, including templates and support for Android/iOS builds.

## Roadmap / TODOs

- [ ] Add support for different templates for easier customization.
- [ ] Add Android and iOS build capabilities for mobile deployment.
- [ ] Provide more in-depth documentation and examples for advanced usage.
- [ ] Integrate more bundling options, like `.apk` and `.ipa` for mobile.

## Contributing

Contributions are encouraged! If you'd like to contribute to `Taurify`, please follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and improvements.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to your branch (`git push origin feature-branch`).
6. Open a pull request on the main repository.

We value any contributions, whether it's new features, bug fixes, documentation improvements, or testing!

## FAQ

- `Error: EPERM: operation not permitted, symlink` on Windows, This tool needs to create symbolic link. Creating symbolic links requires elevated permissions in most cases. Even if you are logged in as an administrator, the command prompt might not be running with elevated privileges. To fix it, try to use one of the following methods.
  - Method 1: Open an elevated Command Prompt. (simple)
      - Press Win + X and select Command Prompt (Admin) or Windows Terminal (Admin).
  - Method 2: On Windows 10/11, you can enable Developer Mode to allow the creation of symbolic links without needing administrator privileges. (prefered)
      - Open Settings (Win + I).
      - Go to Update & Security → For developers.
      - Under Developer Mode, toggle the option to On.
      - After enabling Developer Mode, you should be able to create symlinks without running the command prompt as administrator.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for full details.
