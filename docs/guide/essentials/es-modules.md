# ES Modules

You source code should always be written as ESM. However, you have some control whether an entrypoint is bundled as ESM.

## HTML Pages <Badge type="warning" text="≥0.0.1" />

Vite only supports bundling JS from HTML pages as ESM. Ensure you have added `type="module"` to your `<script>` tags:

<!-- prettier-ignore -->
```html
<script src="./main.ts"></script> <!-- [!code --] -->
<script src="./main.ts" type="module"></script> <!-- [!code ++] -->
```

## Background <Badge type="warning" text="≥0.16.0" />

By default, your background will be bundled into a single file as IIFE. You can change this by setting `type: "module"` in your background entrypoint:

```ts
export default defineBackground({
  type: 'module', // [!code ++]
  main() {
    // ...
  },
});
```

This will change the output format to ESM, enable code-spliting between your background script and HTML pages, and set `"type": "module"` in your manifest.

:::warning
Only MV3 supports ESM background scripts/service workers. When targeting MV2, the `type` option is ignored and the background is always bundled into a single file as IIFE.
:::

## Content Scripts

WXT does not yet include built-in support for bundling content scripts as ESM. The plan is to add support for chunking to reduce bundle size, but not support HMR for now. There are several technical issues that make implementing a generic solution for HMR impossible. See [Content Script ESM Support #357](https://github.com/wxt-dev/wxt/issues/357) for details.

If you can't wait, and need ESM support right now, you can implement ESM support manually. See the [ESM Content Script UI](https://github.com/wxt-dev/examples/tree/main/examples/esm-content-script-ui) example to learn how.
