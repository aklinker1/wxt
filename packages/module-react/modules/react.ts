import 'wxt';
import { addImportPreset, addViteConfig, defineWxtModule } from 'wxt/modules';
import react, { Options as PluginOptions } from '@vitejs/plugin-react';

export default defineWxtModule<ReactModuleOptions>({
  name: '@wxt-dev/module-react',
  configKey: 'react',
  setup(wxt, options) {
    const { vite } = options ?? {};

    addViteConfig(wxt, () => ({
      plugins: [react(vite)],
    }));

    addImportPreset(wxt, 'react');

    // Enable auto-imports for JSX files
    wxt.hook('config:resolved', (wxt) => {
      // In older versions of WXT, `wxt.config.imports` could be false
      if (!wxt.config.imports) return;

      wxt.config.imports.dirsScanOptions ??= {};
      wxt.config.imports.dirsScanOptions.filePatterns = [
        // Default plus JSX/TSX
        '*.{ts,js,mjs,cjs,mts,cts,jsx,tsx}',
      ];
    });
  },
});

export interface ReactModuleOptions {
  vite?: PluginOptions;
}

declare module 'wxt' {
  export interface InlineConfig {
    react?: ReactModuleOptions;
  }
}
