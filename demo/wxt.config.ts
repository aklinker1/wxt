import { defineConfig, scopedVitePlugin } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    permissions: ['storage'],
    default_locale: 'en',
    web_accessible_resources: [
      {
        resources: ['/iframe-src.html'],
        matches: ['*://*.google.com/*'],
      },
    ],
  },
  zip: {
    downloadPackages: ['sass'],
  },
  analysis: {
    open: true,
  },
  vite: () => ({
    plugins: [
      scopedVitePlugin(['popup', 'ui'], () => ({
        name: 'TEST',
        config() {
          console.log('SCOPE APPLIED!');
        },
      })),
    ],
  }),
});
