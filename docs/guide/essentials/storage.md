# Storage

[Chrome Docs](https://developer.chrome.com/docs/extensions/reference/api/storage) • [Firefox Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage)

You can use the vanilla APIs (see docs above), use [WXT's built-in storage API](/storage), or install a package from NPM.

## Alternatives

1. [`wxt/utils/storage`](/storage) (recommended): WXT ships with its own wrapper around the vanilla storage APIs that simplifies common use cases

2. DIY: If you're migrating to WXT and already have a storage wrapper, keep using it. In the future, if you want to delete that code, you can use one of these alternatives, but there's no reason to replace working code during a migration.

3. Any other NPM package: [There are lots of wrappers around the storage API](https://www.npmjs.com/search?q=chrome%20storage), you can find one you like. Here's some popular ones:
   - [`webext-storage`](https://www.npmjs.com/package/webext-storage) - A more usable typed storage API for Web Extensions
   - [`@webext-core/storage`](https://www.npmjs.com/package/@webext-core/storage) - A type-safe, localStorage-esque wrapper around the web extension storage APIs
