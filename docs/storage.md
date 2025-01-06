---
outline: deep
---

# WXT Storage

[Changelog](https://github.com/wxt-dev/wxt/blob/main/packages/wxt/CHANGELOG.md)

A simplified wrapper around the extension storage APIs.

## Installation

### With WXT

This module is built-in to WXT, so you don't need to install anything.

```ts
import { storage } from '#imports';
```

If you use auto-imports, `storage` is auto-imported for you, so you don't even need to import it!

### Without WXT

Install the NPM package:

```sh
npm i @wxt-dev/storage
pnpm add @wxt-dev/storage
yarn add @wxt-dev/storage
bun add @wxt-dev/storage
```

```ts
import { storage } from '@wxt-dev/storage';
```

## Storage Permission

To use the `@wxt-dev/storage` API, the `"storage"` permission must be added to the manifest:

```ts
// wxt.config.ts
export default defineConfig({
  manifest: {
    permissions: ['storage'],
  },
});
```

## Basic Usage

All storage keys must be prefixed by their storage area.

```ts
// ❌ This will throw an error
await storage.getItem('installDate');

// ✅ This is good
await storage.getItem('local:installDate');
```

You can use `local:`, `session:`, `sync:`, or `managed:`.

If you use TypeScript, you can add a type parameter to most methods to specify the expected type of the key's value:

```ts
await storage.getItem<number>('local:installDate');
await storage.watch<number>(
  'local:installDate',
  (newInstallDate, oldInstallDate) => {
    // ...
  },
);
await storage.getMeta<{ v: number }>('local:installDate');
```

For a full list of methods available, see the [API reference](/api/reference/wxt/utils/storage/interfaces/WxtStorage).

## Watchers

To listen for storage changes, use the `storage.watch` function. It lets you set up a listener for a single key:

```ts
const unwatch = storage.watch<number>('local:counter', (newCount, oldCount) => {
  console.log('Count changed:', { newCount, oldCount });
});
```

To remove the listener, call the returned `unwatch` function:

```ts
const unwatch = storage.watch(...);

// Some time later...
unwatch();
```

## Metadata

`@wxt-dev/storage` also supports setting metadata for keys, stored at `key + "$"`. Metadata is a collection of properties associated with a key. It might be a version number, last modified date, etc.

[Other than versioning](#versioning), you are responsible for managing a field's metadata:

```ts
await Promise.all([
  storage.setItem('local:preference', true),
  storage.setMeta('local:preference', { lastModified: Date.now() }),
]);
```

When setting different properties of metadata from multiple calls, the properties are combined instead of overwritten:

```ts
await storage.setMeta('local:preference', { lastModified: Date.now() });
await storage.setMeta('local:preference', { v: 2 });

await storage.getMeta('local:preference'); // { v: 2, lastModified: 1703690746007 }
```

You can remove all metadata associated with a key, or just specific properties:

```ts
// Remove all properties
await storage.removeMeta('local:preference');

// Remove only the "lastModified" property
await storage.removeMeta('local:preference', 'lastModified');

// Remove multiple properties
await storage.removeMeta('local:preference', ['lastModified', 'v']);
```

## Defining Storage Items

Writing the key and type parameter for the same key over and over again can be annoying. As an alternative, you can use `storage.defineItem` to create a "storage item".

Storage items contain the same APIs as the `storage` variable, but you can configure its type, default value, and more in a single place:

```ts
// utils/storage.ts
const showChangelogOnUpdate = storage.defineItem<boolean>(
  'local:showChangelogOnUpdate',
  {
    fallback: true,
  },
);
```

Now, instead of using the `storage` variable, you can use the helper functions on the storage item you created:

```ts
await showChangelogOnUpdate.getValue();
await showChangelogOnUpdate.setValue(false);
await showChangelogOnUpdate.removeValue();
const unwatch = showChangelogOnUpdate.watch((newValue) => {
  // ...
});
```

For a full list of properties and methods available, see the [API reference](/api/reference/wxt/utils/storage/interfaces/WxtStorageItem).

### Versioning

You can add versioning to storage items if you expect them to grow or change over time. When defining the first version of an item, start with version 1.

For example, consider a storage item that stores a list of websites that are ignored by an extension.

:::code-group

```ts [v1]
type IgnoredWebsiteV1 = string;

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV1[]>(
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 1,
  },
);
```

<!-- prettier-ignore -->
```ts [v2]
import { nanoid } from 'nanoid'; // [!code ++]

type IgnoredWebsiteV1 = string;
interface IgnoredWebsiteV2 { // [!code ++]
  id: string; // [!code ++]
  website: string; // [!code ++]
} // [!code ++]

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV1[]>( // [!code --]
export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV2[]>( // [!code ++]
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 1, // [!code --]
    version: 2, // [!code ++]
    migrations: { // [!code ++]
      // Ran when migrating from v1 to v2 // [!code ++]
      2: (websites: IgnoredWebsiteV1[]): IgnoredWebsiteV2[] => { // [!code ++]
        return websites.map((website) => ({ id: nanoid(), website })); // [!code ++]
      }, // [!code ++]
    }, // [!code ++]
  },
);
```

<!-- prettier-ignore -->
```ts [v3]
import { nanoid } from 'nanoid';

type IgnoredWebsiteV1 = string;
interface IgnoredWebsiteV2 {
  id: string;
  website: string;
}
interface IgnoredWebsiteV3 { // [!code ++]
  id: string; // [!code ++]
  website: string; // [!code ++]
  enabled: boolean; // [!code ++]
} // [!code ++]

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV2[]>( // [!code --]
export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV3[]>( // [!code ++]
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 2, // [!code --]
    version: 3, // [!code ++]
    migrations: {
      // Ran when migrating from v1 to v2
      2: (websites: IgnoredWebsiteV1[]): IgnoredWebsiteV2[] => {
        return websites.map((website) => ({ id: nanoid(), website }));
      },
      // Ran when migrating from v2 to v3 // [!code ++]
      3: (websites: IgnoredWebsiteV2[]): IgnoredWebsiteV3[] => { // [!code ++]
        return websites.map((website) => ({ ...website, enabled: true })); // [!code ++]
      }, // [!code ++]
    },
  },
);
```

:::

:::info
Internally, this uses a metadata property called `v` to track the value's current version.
:::

In this case, we thought that the ignored website list might change in the future, and were able to set up a versioned storage item from the start.

Realistically, you won't know an item needs versioning until you need to change its schema. Thankfully, it's simple to add versioning to an unversioned storage item.

When a previous version isn't found, WXT assumes the version was `1`. That means you just need to set `version: 2` and add a migration for `2`, and it will just work!

Let's look at the same ignored websites example from before, but start with an unversioned item this time:

:::code-group

```ts [Unversioned]
export const ignoredWebsites = storage.defineItem<string[]>(
  'local:ignoredWebsites',
  {
    fallback: [],
  },
);
```

<!-- prettier-ignore -->
```ts [v2]
import { nanoid } from 'nanoid'; // [!code ++]

// Retroactively add a type for the first version // [!code ++]
type IgnoredWebsiteV1 = string; // [!code ++]
interface IgnoredWebsiteV2 { // [!code ++]
  id: string; // [!code ++]
  website: string; // [!code ++]
} // [!code ++]

export const ignoredWebsites = storage.defineItem<string[]>( // [!code --]
export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV2[]>( // [!code ++]
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 2, // [!code ++]
    migrations: { // [!code ++]
      // Ran when migrating from v1 to v2 // [!code ++]
      2: (websites: IgnoredWebsiteV1[]): IgnoredWebsiteV2[] => { // [!code ++]
        return websites.map((website) => ({ id: nanoid(), website })); // [!code ++]
      }, // [!code ++]
    }, // [!code ++]
  },
);
```

:::

### Running Migrations

As soon as `storage.defineItem` is called, WXT checks if migrations need to be run, and if so, runs them. Calls to get or update the storage item's value or metadata (`getValue`, `setValue`, `removeValue`, `getMeta`, etc.) will automatically wait for the migration process to finish before actually reading or writing values.

### Default Values

With `storage.defineItem`, there are multiple ways of defining default values:

1. **`fallback`** - Return this value from `getValue` instead of `null` if the value is missing.

   This option is great for providing default values for settings:

   ```ts
   const theme = storage.defineItem('local:theme', {
     fallback: 'dark',
   });
   const allowEditing = storage.defineItem('local:allow-editing', {
     fallback: true,
   });
   ```

2. **`init`** - Initialize and save a value in storage if it is not already saved.

   This is great for values that need to be initialized or set once:

   ```ts
   const userId = storage.defineItem('local:user-id', {
     init: () => globalThis.crypto.randomUUID(),
   });
   const installDate = storage.defineItem('local:install-date', {
     init: () => new Date().getTime(),
   });
   ```

   The value is initialized in storage immediately.

## Bulk Operations

When getting or setting multiple values in storage, you can perform bulk operations to improve performance by reducing the number of individual storage calls. The `storage` API provides several methods for performing bulk operations:

- **`getItems`** - Get multiple values at once.
- **`getMetas`** - Get metadata for multiple items at once.
- **`setItems`** - Set multiple values at once.
- **`setMetas`** - Set metadata for multiple items at once.
- **`removeItems`** - Remove multiple values (and optionally metadata) at once.

All these APIs support both string keys and defined storage items:

```ts
const userId = storage.defineItem('local:userId');

await storage.setItems([
  { key: 'local:installDate', value: Date.now() },
  { item: userId, value: generateUserId() },
]);
```

Refer to the [API Reference](/api/reference/wxt/utils/storage/interfaces/WxtStorage) for types and examples of how to use all the bulk APIs.
