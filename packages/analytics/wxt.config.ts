import { defineConfig } from 'wxt';

export default defineConfig({
  // Unimport doesn't look for imports in node_modules, so when developing a
  // WXT module, we need to disable this to simplify the build process
  imports: false,

  manifest: {
    name: 'Analytics Demo',
  },
});
