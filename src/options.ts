import { resolve } from 'path';

export interface Options {
  productName?: string;
  identifier: string;
  version: string;
  frontendDist?: string;
  outputDir: string;
  icon?: string;
  tauriConfJson?: string;
  verbose: boolean;
  bundles?: string;
}

export const defaultOptions: Options = {
  identifier: `com.tauri-app.app`,
  version: '1.0.0',
  outputDir: '.',
  verbose: false,
  icon: resolve(import.meta.dirname, '..', 'tauri-app', 'app-icon.png'),
};
