# Upgrading WXT

## Overview

To upgrade WXT to the latest version... just install it!

```sh
pnpm i wxt@latest
```

Listed below are all the breaking changes you should address when upgrading to a new version of WXT.

Currently, WXT is in pre-release. This means changes to the second digit, `v0.X`, are considered major and have breaking changes. Once v1 is released, only major version bumps will have breaking changes.

## v0.18.5 &rarr; v0.19.0

### `vite-node` Entrypoint Loader

The default entrypoint loader has changed to `vite-node`. If you use any NPM packages that depend on the `webextension-polyfill`, you need to add them to Vite's `ssr.noExternal` option:

<!-- prettier-ignore -->
```ts
export default defineConfig({
  vite: () => ({ // [!code ++]
    ssr: { // [!code ++]
      noExternal: ['@webext-core/messaging', '@webext-core/proxy-service'], // [!code ++]
    }, // [!code ++]
  }), // [!code ++]
});
```

> [Read the full docs](/guide/essentials/config/entrypoint-loaders#vite-node) for more information.

:::details This change enables:

Importing variables and using them in the entrypoint options:

```ts
// entrypoints/content.ts
import { GOOGLE_MATCHES } from '~/utils/constants'

export default defineContentScript({
  matches: [GOOGLE_MATCHES],
  main: () => ...,
})
```

Using Vite-specific APIs like `import.meta.glob` to define entrypoint options:

```ts
// entrypoints/content.ts
const providers: Record<string, any> = import.meta.glob('../providers/*', {
  eager: true,
});

export default defineContentScript({
  matches: Object.values(providers).flatMap(
    (provider) => provider.default.paths,
  ),
  async main() {
    console.log('Hello content.');
  },
});
```

Basically, you can now import and do things outside the `main` function of the entrypoint - you could not do that before. Still though, be careful. It is recommended to avoid running code outside the `main` function to keep your builds fast.

:::

To continue using the old approach, add the following to your `wxt.config.ts` file:

```ts
export default defineConfig({
  entrypointLoader: 'jiti', // [!code ++]
});
```

:::warning
`entrypointLoader: "jiti"` is deprecated and will be removed in the next major version.
:::

### Drop CJS Support

WXT no longer ships with Common JS support. If you're using CJS, here's your migration steps:

1. Add [`"type": "module"`](https://nodejs.org/api/packages.html#type) to your `package.json`.
2. Change the file extension of any `.js` files that use CJS syntax to `.cjs`, or update them to use EMS syntax.

Vite also provides steps for migrating to ESM. Check them out for more details: <https://vitejs.dev/guide/migration#deprecate-cjs-node-api>

## v0.18.0 &rarr; v0.18.5

> When this version was released, it was not considered a breaking change... but it should have been.

### New `modules/` Directory

WXT now recognizes the `modules/` directory as a folder containing [WXT modules](/guide/essentials/wxt-modules).

If you already have `<srcDir>/modules` or `<srcDir>/Modules` directory, `wxt prepare` and other commands will fail.

You have two options:

1. [Recommended] Keep your files where they are and tell WXT to look in a different folder:

   ```ts
   // wxt.config.ts
   export default defineConfig({
     modulesDir: 'wxt-modules', // defaults to "modules"
   });
   ```

2. Rename your `modules` directory to something else.

## v0.17.0 &rarr; v0.18.0

### Automatic MV3 `host_permissions` to MV2 `permissions`

> Out of an abundance of caution, this change has been marked as a breaking change because permission generation is different.

If you list `host_permissions` in your `wxt.config.ts`'s manifest and have released your extension, double check that your `permissions` and `host_permissions` have not changed for all browsers you target in your `.output/*/manifest.json` files. Permission changes can cause the extension to be disabled on update, and can cause a drop in users, so be sure to double check for differences compared to the previous manifest version.

## v0.16.0 &rarr; v0.17.0

### Storage - `defineItem` Requires `defaultValue` Option

If you were using `defineItem` with versioning and no default value, you will need to add `defaultValue: null` to the options and update the first type parameter:

```ts
const item = storage.defineItem<number>("local:count", { // [!code --]
const item = storage.defineItem<number | null>("local:count", { // [!code ++]
defaultValue: null, // [!code ++]
  version: ...,
  migrations: ...,
})
```

The `defaultValue` property is now required if passing in the second options argument.

If you exclude the second options argument, it will default to being nullable, as before.

```ts
const item: WxtStorageItem<number | null> =
  storage.defineItem<number>('local:count');
const value: number | null = await item.getValue();
```

### Storage - Fix Types In `watch` Callback

> If you don't use TypeScript, this isn't a breaking change, this is just a type change.

```ts
const item = storage.defineItem<number>('local:count', { defaultValue: 0 });
item.watch((newValue: number | null, oldValue: number | null) => { // [!code --]
item.watch((newValue: number, oldValue: number) => { // [!code ++]
  // ...
});
```

## v0.15.0 &rarr; v0.16.0

### Output Directory Structure Changed

JS entrypoints in the output directory have been moved. Unless you're doing some kind of post-build work referencing files, you don't have to make any changes.

```plaintext
.output/
  <target>/
    chunks/
      some-shared-chunk-<hash>.js
      popup-<hash>.js // [!code --]
    popup.html
    popup.html
    popup.js // [!code ++]
```

## v0.14.0 &rarr; v0.15.0

### Renamed `zip.ignoredSources` to `zip.excludeSources`

```ts
// wxt.config.ts
export default defineConfig({
  zip: {
    ignoredSources: [
      /*...*/
    ], // [!code --]
    excludeSources: [
      /*...*/
    ], // [!code ++]
  },
});
```

### Renamed Undocumented Constants

Renamed undocumented constants for detecting the build config at runtime in [#380](https://github.com/wxt-dev/wxt/pull/380). Now documented here: <https://wxt.dev/guide/multiple-browsers.html#runtime>

- `__BROWSER__` → `import.meta.env.BROWSER`
- `__COMMAND__` → `import.meta.env.COMMAND`
- `__MANIFEST_VERSION__` → `import.meta.env.MANIFEST_VERSION`
- `__IS_CHROME__` → `import.meta.env.CHROME`
- `__IS_FIREFOX__` → `import.meta.env.FIREFOX`
- `__IS_SAFARI__` → `import.meta.env.SAFARI`
- `__IS_EDGE__` → `import.meta.env.EDGE`
- `__IS_OPERA__` → `import.meta.env.OPERA`

## v0.13.0 &rarr; v0.14.0

### Content Script UI API changes

`createContentScriptUi` and `createContentScriptIframe`, and some of their options, have been renamed:

- `createContentScriptUi({ ... })` &rarr; `createShadowRootUi({ ... })`
- `createContentScriptIframe({ ... })` &rarr; `createIframeUi({ ... })`
- `type: "inline" | "overlay" | "modal"` has been changed to `position: "inline" | "overlay" | "modal"`
- `onRemove` is now called **_before_** the UI is removed from the DOM, previously it was called after the UI was removed
- `mount` option has been renamed to `onMount`, to better match the related option, `onRemove`.

## v0.12.0 &rarr; v0.13.0

### New `wxt/storage` APIs

`wxt/storage` no longer relies on [`unstorage`](https://www.npmjs.com/package/unstorage). Some `unstorage` APIs, like `prefixStorage`, have been removed, while others, like `snapshot`, are methods on the new `storage` object. Most of the standard usage remains the same. See <https://wxt.dev/guide/storage> and <https://wxt.dev/api/reference/wxt/storage/> for more details ([#300](https://github.com/wxt-dev/wxt/pull/300))

## v0.11.0 &rarr; v0.12.0

### API Exports Changed

`defineContentScript` and `defineBackground` are now exported from `wxt/sandbox` instead of `wxt/client`. ([#284](https://github.com/wxt-dev/wxt/pull/284))

- If you use auto-imports, no changes are required.
- If you have disabled auto-imports, you'll need to manually update your import statements:

  ```ts
  import { defineBackground, defineContentScript } from 'wxt/client'; // [!code --]
  import { defineBackground, defineContentScript } from 'wxt/sandbox'; // [!code ++]
  ```

## v0.10.0 &rarr; v0.11.0

### Vite 5

You will need to update any other Vite plugins to a version that supports Vite 5.

## v0.9.0 &rarr; v0.10.0

### Extension Icon Discovery

WXT no longer discovers icons other than `.png` files. If you previously used `.jpg`, `.jpeg`, `.bmp`, or `.svg`, you'll need to convert your icons to `.png` files or manually add them to the manifest inside your `wxt.config.ts` file.

## v0.8.0 &rarr; v0.9.0

### Removed `WebWorker` Types by Default

Removed [`"WebWorker"` types](https://www.typescriptlang.org/tsconfig/lib.html) from `.wxt/tsconfig.json`. These types are useful for MV3 projects using a service worker.

To add them back to your project, add the following to your project's TSConfig:

```json
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    // [!code ++]
    "lib": ["ESNext", "DOM", "WebWorker"] // [!code ++]
  } // [!code ++]
}
```

## v0.7.0 &rarr; v0.8.0

### `defineUnlistedScript`

Unlisted scripts must now `export default defineUnlistedScript(...)`.

### `BackgroundDefinition` Type

Rename `BackgroundScriptDefintition` to `BackgroundDefinition`.

## v0.6.0 &rarr; v0.7.0

### Content Script CSS Output Location Changed

Content script CSS used to be output to `assets/<name>.css`, but is now `content-scripts/<name>.css` to match the docs.

## v0.5.0 &rarr; v0.6.0

### Require a Function for `vite` Config

The `vite` config option must now be a function. If you were using an object before, change it from `vite: { ... }` to `vite: () => ({ ... })`.

## v0.4.0 &rarr; v0.5.0

### Revert Move Public Directory

Change default `publicDir` to from `<rootDir>/public` to `<srcDir>/public`.

## v0.3.0 &rarr; v0.4.0

### Update Default Path Aliases

Use relative path aliases inside `.wxt/tsconfig.json`.

## v0.2.0 &rarr; v0.3.0

### Move Public Directory

Change default `publicDir` to from `<srcDir>/public` to `<rootDir>/public`.

### Improve Type Safety

Add type safety to `browser.runtime.getURL`.

## v0.1.0 &rarr; v0.2.0

### Rename `defineBackground`

Rename `defineBackgroundScript` to `defineBackground`.
