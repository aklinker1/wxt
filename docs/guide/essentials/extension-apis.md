# Extension APIs

[Chrome Docs](https://developer.chrome.com/docs/extensions/reference/api) • [Firefox Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)

Different browsers provide different global variables for accessing the extension APIs (chrome provides `chrome`, firefox provides `browser`, etc).

WXT merges these two into a unified API accessed through the `browser` variable.

```ts
import { browser } from 'wxt/browser';

browser.action.onClicked.addListener(() => {
  // ...
});
```

:::tip
With auto-imports enabled, you don't even need to import this variable from `wxt/browser`!
:::

The `browser` variable WXT provides is a simple export of the `browser` or `chrome` globals provided by the browser at runtime:

<<< @/../packages/wxt/src/browser.ts#snippet

This means you can use the promise-style API for both MV2 and MV3, and it will work across all browsers (Chromium, Firefox, Safari, etc).

## Accessing Types

All types can be accessed via WXT's `browser` object:

```ts
function handleMessage(message: any, sender: browser.runtime.Sender) {
  // ...
}
```

## Feature Detection

Depending on the manifest version, browser, and permissions, some APIs are not available at runtime. If an API is not available, it will be `undefined`.

:::warning
Types will not help you here. The types WXT provides for `browser` assume all APIs exist. You are responsible for knowing whether an API is available or not.
:::

To check if an API is available, use feature detection:

```ts
if (browser.runtime.onSuspend != null) {
  browser.runtime.onSuspend.addListener(() => {
    // ...
  });
}
```

Here, [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) is your best friend:

```ts
browser.runtime.onSuspend?.addListener(() => {
  // ...
});
```

Alternatively, if you're trying to use similar APIs under different names (to support MV2 and MV3), you can do something like this:

```ts
(browser.action ?? browser.browser_action).onClicked.addListener(() => {
  //
});
```
