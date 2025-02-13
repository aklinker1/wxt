# Manifest

In WXT, there is no `manifest.json` file in your source code. Instead, WXT generates the manifest from multiple sources:

- Global options [defined in your `wxt.config.ts` file](#global-options)
- Entrypoint-specific options [defined in your entrypoints](/guide/essentials/entrypoints#defining-manifest-options)
- [WXT Modules](/guide/essentials/wxt-modules) added to your project can modify your manifest
- [Hooks](/guide/essentials/config/hooks) defined in your project can modify your manifest

Your extension's `manifest.json` will be output to `.output/{target}/manifest.json` when running `wxt build`.

## Global Options

To add a property to your manifest, use the `manifest` config inside your `wxt.config.ts`:

```ts
export default defineConfig({
  manifest: {
    // Put manual changes here
  },
});
```

You can also define the manifest as a function, and use JS to generate it based on the target browser, mode, and more.

```ts
export default defineConfig({
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      // ...
    };
  },
});
```

### MV2 and MV3 Compatibility

When adding properties to the manifest, always define the property in it's MV3 format when possible. When targeting MV2, WXT will automatically convert these properties to their MV2 format.

For example, for this config:

```ts
export default defineConfig({
  manifest: {
    action: {
      default_title: 'Some Title',
    },
    web_accessible_resources: [
      {
        matches: ['*://*.google.com/*'],
        resources: ['icon/*.png'],
      },
    ],
  },
});
```

WXT will generate the following manifests:

:::code-group

```json [MV2]
{
  "manifest_version": 2,
  // ...
  "browser_action": {
    "default_title": "Some Title"
  },
  "web_accessible_resources": ["icon/*.png"]
}
```

```json [MV3]
{
  "manifest_version": 3,
  // ...
  "action": {
    "default_title": "Some Title"
  },
  "web_accessible_resources": [
    {
      "matches": ["*://*.google.com/*"],
      "resources": ["icon/*.png"]
    }
  ]
}
```

:::

You can also specify properties specific to a single manifest version, and they will be stripped out when targeting the other manifest version.

## Name

> [Chrome Docs](https://developer.chrome.com/docs/extensions/mv3/manifest/name/)

If not provided via the `manifest` config, the manifest's `name` property defaults to your `package.json`'s `name` property.

## Version and Version Name

> [Chrome Docs](https://developer.chrome.com/docs/extensions/mv3/manifest/version/)

Your extension's `version` and `version_name` is based on the `version` from your `package.json`.

- `version_name` is the exact string listed
- `version` is the string cleaned up, with any invalid suffixes removed

Example:

```json
// package.json
{
  "version": "1.3.0-alpha2"
}
```

```json
// .output/<target>/manifest.json
{
  "version": "1.3.0",
  "version_name": "1.3.0-alpha2"
}
```

If a version is not present in your `package.json`, it defaults to `"0.0.0"`.

## Icons

WXT automatically discovers your extension's icon by looking at files in the `public/` directory:

```plaintext
public/
├─ icon-16.png
├─ icon-24.png
├─ icon-48.png
├─ icon-96.png
└─ icon-128.png
```

Specifically, an icon must match one of these regex to be discovered:

<<< @/../packages/wxt/src/core/utils/manifest.ts#snippet

If you don't like these filename or you're migrating to WXT and don't want to rename the files, you can manually specify an `icon` in your manifest:

```ts
export default defineConfig({
  manifest: {
    icons: {
      16: '/extension-icon-16.png',
      24: '/extension-icon-24.png',
      48: '/extension-icon-48.png',
      96: '/extension-icon-96.png',
      128: '/extension-icon-128.png',
    },
  },
});
```

Alternatively, you can use [`@wxt-dev/auto-icons`](https://www.npmjs.com/package/@wxt-dev/auto-icons) to let WXT generate your icon at the required sizes.

## Permissions

> [Chrome docs](https://developer.chrome.com/docs/extensions/reference/permissions/)

Most of the time, you need to manually add permissions to your manifest. Only in a few specific situations are permissions added automatically:

- During development: the `tabs` and `scripting` permissions will be added to enable hot reloading.
- When a `sidepanel` entrypoint is present: The `sidepanel` permission is added.

```ts
export default defineConfig({
  manifest: {
    permissions: ['storage', 'tabs'],
  },
});
```

## Host Permissions

> [Chrome docs](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions#host-permissions)

```ts
export default defineConfig({
  manifest: {
    permissions: ['storage', 'tabs'],
  },
});
```

:::warning
If you use host permissions and target both MV2 and MV3, make sure to only include the required host permissions for each version:

```ts
export default defineConfig({
  manifest: ({ manifestVersion }) => ({
    host_permissions: manifestVersion === 2 ? [...] : [...],
  }),
});
```

:::

## Default Locale

```ts
export default defineConfig({
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
  },
});
```

> See [I18n docs](/guide/essentials/i18n) for a full guide on internationalizing your extension.

## Actions

In MV2, you have two options: [`browser_action`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_action) and [`page_action`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/page_action). In MV3, they were merged into a single [`action`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/action) API.

By default, whenever an `action` is generated, WXT falls back to `browser_action` when targeting MV2.

### Action With Popup

To generate a manifest where a UI appears after clicking the icon, just create a [Popup entrypoint](/guide/essentials/entrypoints#popup). If you want to use a `page_action` for MV2, add the following meta tag to the HTML document's head:

```html
<meta name="manifest.type" content="page_action" />
```

### Action Without Popup

If you want to use the `activeTab` permission or the `browser.action.onClicked` event, but don't want to show a popup:

1. Delete the [Popup entrypoint](/guide/essentials/entrypoints#popup) if it exists
2. Add the `action` key to your manifest:

   ```ts
   export default defineConfig({
     manifest: {
       action: {},
     },
   });
   ```

Same as an action with a popup, WXT will fallback on using `browser_action` for MV2. To use a `page_action` instead, add that key as well:

```ts
export default defineConfig({
  manifest: {
    action: {},
    page_action: {},
  },
});
```
