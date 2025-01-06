import { defineBuildConfig } from 'unbuild';
import { resolve } from 'node:path';

export default defineBuildConfig({
  rootDir: 'modules',
  outDir: resolve(__dirname, 'dist'),
  entries: [
    { input: 'webextension-polyfill/index.ts', name: 'index' },
    { input: 'webextension-polyfill/browser.ts', name: 'browser' },
  ],
  replace: {
    'process.env.NPM': 'true',
  },
  declaration: true,
});
