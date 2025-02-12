# Runtime Config

> This API is still a WIP, with more features coming soon!

Define runtime configuration in a single place, `<srcDir>/app.config.ts`:

```ts
import { defineAppConfig } from 'wxt/sandbox';

// Define types for your config
declare module 'wxt/sandbox' {
  export interface WxtAppConfig {
    theme?: 'light' | 'dark';
  }
}

export default defineAppConfig({
  theme: 'dark',
});
```

:::warning
This file is committed to the repo, so don't put any secrets here. Instead, use [Environment Variables](/guide/essentials/config/environment-variables).
:::

To access runtime config, WXT provides the `useAppConfig` function:

```ts
import { useAppConfig } from 'wxt/sandbox';

console.log(useAppConfig()); // { theme: "dark" }
```

## Environment Variables in App Config

You can use environment variables in the `app.config.ts` file.

```ts
declare module 'wxt/sandbox' {
  export interface WxtAppConfig {
    apiKey?: string;
    skipWelcome: boolean;
  }
}

export default defineAppConfig({
  apiKey: import.meta.env.WXT_API_KEY,
  skipWelcome: import.meta.env.WXT_SKIP_WELCOME === 'true',
});
```

This has several advantages:

- Define all expected environment variables in a single file
- Convert strings to other types, like booleans or arrays
- Provide default values if an environment variable is not provided
