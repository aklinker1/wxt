# Auto-imports

WXT uses [`unimport`](https://www.npmjs.com/package/unimport), the same tool as Nuxt, to setup auto-imports.

```ts
export default defineConfig({
  // See https://www.npmjs.com/package/unimport#configurations
  imports: {
    // ...
  },
});
```

By default, WXT automatically sets up auto-imports for all of it's own APIs and some of your project directories:

- `<srcDir>/components/*`
- `<srcDir>/composables/*`
- `<srcDir>/hooks/*`
- `<srcDir>/utils/*`

All named and default exports from files in these directories are available everywhere else in your project without having to import them.

To see the complete list of auto-imported APIs, run [`wxt prepare`](/api/cli/wxt-prepare) and look at your project's `.wxt/types/imports-module.d.ts` file.

## TypeScript

For TypeScript and your editor to recognize auto-imported variables, you need to run the [`wxt prepare` command](/api/cli/wxt-prepare).

Add this command to your `postinstall` script so your editor has everything it needs to report type errors after installing dependencies:

```jsonc
// package.json
{
  "scripts": {
    "postinstall": "wxt prepare", // [!code ++]
  },
}
```

## ESLint

ESLint doesn't know about the auto-imported variables unless they are explicitly defined in the ESLint's `globals`. By default, WXT will generate the config if it detects ESLint is installed in your project. If the config isn't generated automatically, you can manually tell WXT to generate it.

:::code-group

```ts [ESLint 9]
export default defineConfig({
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
});
```

```ts [ESLint 8]
export default defineConfig({
  imports: {
    eslintrc: {
      enabled: 8,
    },
  },
});
```

:::

Then in your ESLint config, import and use the generated file:

:::code-group

```js [ESLint 9]
// eslint.config.mjs
import autoImports from './.wxt/eslint-auto-imports.mjs';

export default [
  autoImports,
  {
    // The rest of your config...
  },
];
```

```js [ESLint 8]
// .eslintrc.mjs
export default {
  extends: ['./.wxt/eslintrc-auto-import.json'],
  // The rest of your config...
};
```

:::

## Disabling Auto-imports

Not all developers like auto-imports. To disable them, set `imports` to `false`.

```ts
export default defineConfig({
  imports: false, // [!code ++]
});
```

## Explicit Imports (`#imports`)

You can manually import all of WXT's APIs via the `#imports` module:

```ts
import {
  createShadowRootUi,
  ContentScriptContext,
  MatchPattern,
} from '#imports';
```

To learn more about how the `#imports` module works, read the [related blog post](/blog/2024-12-06-using-imports-module).

If you've disabled auto-imports, you should still use `#imports` to import all of WXT's APIs from a single place.
