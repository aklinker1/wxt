import { defineConfig } from 'wxt';
import { presetUno } from 'unocss';

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
  runner: {
    startUrls: ['https://duckduckgo.com'],
  },
  example: {
    a: 'a',
    // @ts-expect-error: c is not defined, this should be a type error, but it should show up in the module
    c: 'c',
  },
  unocss: {
    excludeEntrypoints: [
      'example',
      'iframe-src',
      'injected',
      'example-tsx',
      'example-2',
      'iframe',
      'location-change',
      'main-world',
      'sandbox',
      'sidepanel',
      'unlisted',
    ],
    configOrPath: {
      content: {
        pipeline: {
          include: [
            // the default
            /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
            // include js/ts files
            'src/entrypoints/**/*.{js,ts}',
          ],
        },
      },
      presets: [presetUno()],
    },
  },
});
