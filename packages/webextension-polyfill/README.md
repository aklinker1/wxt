# `@wxt-dev/webextension-polyfill`

Configures `wxt/browser` to import `browser` from [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) instead of using the regular `chrome`/`browser` globals WXT normally provides.

## Usage

```sh
pnpm i @wxt-dev/webextension-polyfill webextension-polyfill
```

Then add the module to your config:

```ts
// wxt.config.ts
export default defineConfig({
  modules: ['@wxt-dev/webextension-polyfill'],
});
```
