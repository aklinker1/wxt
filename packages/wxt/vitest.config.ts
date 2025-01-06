import { defineConfig } from 'vitest/config';
import path from 'node:path';
import RandomSeed from 'vitest-plugin-random-seed';

export default defineConfig({
  test: {
    mockReset: true,
    restoreMocks: true,
    testTimeout: 120e3,
    coverage: {
      include: ['src/**'],
      exclude: ['**/dist', '**/__tests__', 'src/utils/testing'],
    },
    setupFiles: ['./vitest.setup.ts'],
    globalSetup: ['./vitest.globalSetup.ts'],
  },
  server: {
    watch: {
      ignored: '**/dist/**',
    },
  },
  plugins: [RandomSeed()],
  resolve: {
    alias: {
      'wxt/testing': path.resolve('src/testing'),
    },
  },
});
