import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      'webextension-polyfill': path.resolve('../wxt/src/virtual/mock-browser'),
    },
  },
});
