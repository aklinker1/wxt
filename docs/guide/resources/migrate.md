---
outline: deep
---

# Migrate to WXT

> If you have problems migrating to WXT, feel free to ask for help in GitHub by [starting a discussion](https://github.com/wxt-dev/wxt/discussions/new?category=q-a) or in [Discord](https://discord.gg/ZFsZqGery9)!

## Overview

Always start by generating a new vanilla project and merging it into your project one file at a time.

```sh
cd path/to/your/project
pnpm dlx wxt@latest init example-wxt --template vanilla
```

In general, you'll need to:

&ensp;<input type="checkbox" /> Install `wxt`<br />
&ensp;<input type="checkbox" /> [Extend `.wxt/tsconfig.json`](/guide/essentials/config/typescript#typescript-configuration) in your project's `tsconfig.json`<br />
&ensp;<input type="checkbox" /> Update/create `package.json` scripts to use `wxt` (don't forget about `postinstall`)<br />
&ensp;<input type="checkbox" /> Move entrypoints into `entrypoints/` directory<br />
&ensp;<input type="checkbox" /> Move assets into either the `assets/` or `public/` directories<br />
&ensp;<input type="checkbox" /> Move `manifest.json` content into `wxt.config.ts`<br />
&ensp;<input type="checkbox" /> Convert custom import syntax to be compatible with Vite<br />
&ensp;<input type="checkbox" /> Add a default export to JS entrypoints (`defineBackground`, `defineContentScript`, or `defineUnlistedScript`)<br />
&ensp;<input type="checkbox" /> Use the `browser` global instead of `chrome`<br />
&ensp;<input type="checkbox" /> ⚠️ Compare final `manifest.json` files, making sure permissions and host permissions are unchanged<br/>
:::warning
If your extension is already live on the Chrome Web Store, use [Google's update testing tool](https://github.com/GoogleChromeLabs/extension-update-testing-tool) to make sure no new permissions are being requested.
:::

Every project is different, so there's no one-solution-fits-all to migrating your project. Just make sure `wxt dev` runs, `wxt build` results in a working extension, and the list of permissions in the `manifest.json` hasn't changed. If all that looks good, you've finished migrating your extension!

## Popular Tools/Frameworks

Here's specific steps for other popular frameworks/build tools.

### Plasmo

1. Install `wxt`
2. Move entrypoints into `entrypoints/` directory
   - For JS entrypoints, merge the named exports used to configure your JS entrypoints into WXT's default export
   - For HTML entrypoints, you cannot use JSX/Vue/Svelte files directly, you need to create an HTML file and manually create and mount your app. Refer to the [React](https://github.com/wxt-dev/wxt/tree/main/templates/react/entrypoints/popup), [Vue](https://github.com/wxt-dev/wxt/tree/main/templates/vue/entrypoints/popup), and [Svelte](https://github.com/wxt-dev/wxt/tree/main/templates/svelte/src/entrypoints/popup) templates as an example.
3. Move public `assets/*` into the `public/` directory
4. If you use CSUI, migrate to WXT's `createContentScriptUi`
5. Convert Plasmo's custom import resolutions to Vite's
6. If importing remote code via a URL, add a `url:` prefix so it works with WXT
7. Replace your [Plasmo tags](https://docs.plasmo.com/framework/workflows/build#with-a-custom-tag) (`--tag`) with [WXT build modes](/guide/essentials/config/build-mode) (`--mode`)
8. ⚠️ Compare the old production manifest to `.output/*/manifest.json`. They should have the same content as before. If not, tweak your entrypoints and config until they are the same.

### CRXJS

If you used CRXJS's vite plugin, it's a simple refactor! The main difference between CRXJS and WXT is how the tools decide which entrypoints to build. CRXJS looks at your `manifest` (and vite config for "unlisted" entries), while WXT looks at files in the `entrypoints` directory.

To migrate:

1. Move all entrypoints into the `entrypoints` directory, refactoring to WXT's style (TS files have a default export).
2. Move [entrypoint specific options out of the manifest](/guide/essentials/entrypoints#defining-manifest-options) and into the entrypoint files themselves (like content script `matches` or `run_at`).
3. Move any other `manifest.json` options [into the `wxt.config.ts` file](/guide/essentials/config/manifest), like permissions.
4. For simplicity, you'll probably want to [disable auto-imports](/guide/essentials/config/auto-imports#disabling-auto-imports) at first (unless you were already using them via `unimport` or `unplugin-auto-imports`). If you like the feature, you can enable it later once you've finished the migration.
5. Update your `package.json` to include all of [WXT's suggested scripts (see step 4)](/guide/installation#from-scratch)
6. Specifically, make sure you add the `"postinstall": "wxt prepare"` script to your `package.json`.
7. Delete your `vite.config.ts` file. Move any plugins into the `wxt.config.ts` file. If you use a frontend framework, [install the relevant WXT module](/guide/essentials/frontend-frameworks).
8. Update your typescript project. [Extend WXT's generated config](/guide/essentials/config/typescript), and [add any path aliases to your `wxt.config.ts` file](/guide/essentials/config/typescript#tsconfig-paths).
9. ⚠️ Compare the old production manifest to `.output/*/manifest.json`. They should have the same content as before. If not, tweak your entrypoints and config until they are the same.

Here's an example migration: [GitHub Better Line Counts - CRXJS &rarr; WXT](https://github.com/aklinker1/github-better-line-counts/commit/39d766d2ba86866efefc2e9004af554ee434e2a8)

### `vite-plugin-web-extension`

Since you're already using Vite, it's a simple refactor.

1. Install `wxt`
2. Move and refactor your entrypoints to WXT's style (with a default export)
3. Update package.json scripts to use `wxt`
4. Add `"postinstall": "wxt prepare"` script
5. Move the `manifest.json` into `wxt.config.ts`
6. Move any custom settings from `vite.config.ts` into `wxt.config.ts`'s
7. ⚠️ Compare the old production manifest to `.output/*/manifest.json`. They should have the same content as before. If not, tweak your entrypoints and config until they are the same.
