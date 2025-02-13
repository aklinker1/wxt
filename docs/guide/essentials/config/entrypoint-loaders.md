# Entrypoint Loaders

To generate the manifest and other files at build-time, WXT must import each entrypoint to get their options, like content script `matches`. For HTML files, this is easy. For JS/TS entrypoints, the process is more complicated.

When loading your JS/TS entrypoints, they are imported into a NodeJS environment, not the `browser` environment that they normally run in. This can lead to issues commonly seen when running browser-only code in a NodeJS environment, like missing global variables.

WXT does several pre-processing steps to try and prevent errors during this process:

1. Use `linkedom` to make a small set of browser globals (`window`, `document`, etc) available.
2. Use `@webext-core/fake-browser` to create a fake version of the `chrome` and `browser` globals expected by extensions.
3. Pre-process the JS/TS code, stripping out the `main` function then tree-shaking unused code from the file

However, this process is not perfect. It doesn't setup all the globals found in the browser and the APIs may behave differently. As such, **_you should avoid using browser or extension APIs outside the `main` function of your entrypoints!_**

:::tip
If you're running into errors while importing entrypoints, run `wxt prepare --debug` to see more details about this process. When debugging, WXT will print out the pre-processed code to help you identify issues.
:::

Once the environment has been polyfilled and your code pre-processed, it's up the entrypoint loader to import your code, extracting the options from the default export.

There are two options for loading your entrypoints:

1. `vite-node` - default as of `v0.19.0`
2. `jiti` (**DEPRECATED, will be removed in `v0.20.0`**) - Default before `v0.19.0`

## vite-node

Since 0.19.0, WXT uses `vite-node`, the same tool that powers Vitest and Nuxt, to import your entrypoint files. It re-uses the same vite config used when building your extension, making it the most stable entrypoint loader.

## jiti

To enable `jiti`:

```ts
export default defineConfig({
  entrypointLoader: 'jiti',
});
```

This is the original method WXT used to import TS files. However, because it doesn't support vite plugins like `vite-node`, it does one additional pre-processing step: It removes **_ALL_** imports from your code.

That means you cannot use imported variables outside the `main` function in JS entrypoints, like for content script `matches` or other options:

```ts
// entrypoints/content.ts
import { GOOGLE_MATCHES } from '~/utils/match-patterns';

export default defineContentScript({
  matches: GOOGLE_MATCHES,
  main() {
    // ...
  },
});
```

```sh
$ wxt build
wxt build

WXT 0.14.1
ℹ Building chrome-mv3 for production with Vite 5.0.5
✖ Command failed after 360 ms

[8:55:54 AM]  ERROR  entrypoints/content.ts: Cannot use imported variable "GOOGLE_MATCHES" before main function.
```

Usually, this error occurs when you try to extract options into a shared file or when running code outside the `main` function. To fix the example from above, use literal values when defining an entrypoint instead of importing them:

```ts
import { GOOGLE_MATCHES } from '~/utils/match-patterns'; // [!code --]

export default defineContentScript({
  matches: GOOGLE_MATCHES, // [!code --]
  matches: ['*//*.google.com/*'], // [!code ++]
  main() {
    // ...
  },
});
```
