# Environment Variables

## Dotenv Files

WXT supports [dotenv files the same way as Vite](https://vite.dev/guide/env-and-mode.html#env-files). Create any of the following files:

```plaintext
.env
.env.local
.env.[mode]
.env.[mode].local
.env.[browser]
.env.[browser].local
.env.[mode].[browser]
.env.[mode].[browser].local
```

And any environment variables listed inside them will be available at runtime:

```sh
# .env
WXT_API_KEY=...
```

```ts
await fetch(`/some-api?apiKey=${import.meta.env.WXT_API_KEY}`);
```

Remember to prefix any environment variables with `WXT_` or `VITE_`, otherwise they won't be available at runtime, as per [Vite's convention](https://vite.dev/guide/env-and-mode.html#env-files).

## Built-in Environment Variables

WXT provides some custom environment variables based on the current command:

| Usage                              | Type      | Description                                           |
| ---------------------------------- | --------- | ----------------------------------------------------- |
| `import.meta.env.MANIFEST_VERSION` | `2 │ 3`   | The target manifest version                           |
| `import.meta.env.BROWSER`          | `string`  | The target browser                                    |
| `import.meta.env.CHROME`           | `boolean` | Equivalent to `import.meta.env.BROWSER === "chrome"`  |
| `import.meta.env.FIREFOX`          | `boolean` | Equivalent to `import.meta.env.BROWSER === "firefox"` |
| `import.meta.env.SAFARI`           | `boolean` | Equivalent to `import.meta.env.BROWSER === "safari"`  |
| `import.meta.env.EDGE`             | `boolean` | Equivalent to `import.meta.env.BROWSER === "edge"`    |
| `import.meta.env.OPERA`            | `boolean` | Equivalent to `import.meta.env.BROWSER === "opera"`   |

You can also access all of [Vite's environment variables](https://vite.dev/guide/env-and-mode.html#env-variables):

| Usage                  | Type      | Description                                                                 |
| ---------------------- | --------- | --------------------------------------------------------------------------- |
| `import.meta.env.MODE` | `string`  | The [mode](/guide/essentials/config/build-mode) the extension is running in |
| `import.meta.env.PROD` | `boolean` | When `NODE_ENV='production'`                                                |
| `import.meta.env.DEV`  | `boolean` | Opposite of `import.meta.env.PROD`                                          |

:::details Other Vite Environment Variables
Vite provides two other environment variables, but they aren't useful in WXT projects:

- `import.meta.env.BASE_URL`: Use `browser.runtime.getURL` instead.
- `import.meta.env.SSR`: Always `false`.
  :::

## Manifest

To use environment variables in the manifest, you need to use the function syntax:

```ts
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: { // [!code --]
    oauth2: { // [!code --]
      client_id: import.meta.env.WXT_APP_CLIENT_ID // [!code --]
    } // [!code --]
  } // [!code --]
  manifest: () => ({ // [!code ++]
    oauth2: { // [!code ++]
      client_id: import.meta.env.WXT_APP_CLIENT_ID // [!code ++]
    } // [!code ++]
  }), // [!code ++]
});
```

WXT can't load your `.env` files until after the config file has been loaded. So by using the function syntax for `manifest`, it defers creating the object until after the `.env` files are loaded into the process.
