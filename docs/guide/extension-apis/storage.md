---
outline: deep
---

# Storage API

WXT provides a simplified API to replace the `browser.storage.*` APIs. Use the `storage` auto-import from `wxt/storage` or import it manually to get started:

```ts
import { storage } from 'wxt/storage';
```

:::warning
To use the `wxt/storage` API, the `"storage"` permission must be added to the manifest:

```ts
// wxt.config.ts
export default defineConfig({
  manifest: {
    permissions: ['storage'],
  },
});
```

More info on permissions [here](/guide/key-concepts/manifest#permissions).
:::

[[toc]]

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

For a full list of methods available, see the [API reference](/api/reference/wxt/storage/interfaces/WxtStorage).

## Watchers

To listen for storage changes, use the `storage.watch` function. It lets you setup a listener for a single key:

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

`wxt/storage` also supports setting metadata for keys, stored at `key + "$"`. Metadata is a collection of properties associated with a key. It might be a version number, last modified date, etc.

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

// Remove one property
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
    defaultValue: true,
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

For a full list of properties and methods available, see the [API reference](/api/reference/wxt/storage/interfaces/WxtStorageItem).

### Versioning

You can add versioning to storage items if you expect them to grow or change over time. When defining the first version of an item, start with version 1.

For example, consider a storage item that stores a list of websites that are ignored by an extension.

:::code-group

```ts [v1]
type IgnoredWebsiteV1 = string;

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV1[]>(
  'local:ignoredWebsites',
  {
    defaultValue: [],
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
    defaultValue: [],
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
    defaultValue: [],
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

In this case, we thought that the ignored website list might change in the future, and were able to setup a versioned storage item from the start.

Realistically, you won't know a item needs versioned until you need to change it's schema. Thankfully, it's simple to add versioning to an unversioned storage item.

When a previous version isn't found, WXT assumes the version was `1`. That means you just need to set `version: 2` and add a migration for `2`, and it will just work!

Lets look at the same ignored websites example from before, but start with an unversioned item this time:

:::code-group

```ts [Unversioned]
export const ignoredWebsites = storage.defineItem<string[]>(
  'local:ignoredWebsites',
  {
    defaultValue: [],
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
    defaultValue: [],
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

As soon as `storage.defineItem` is called, WXT checks if migrations need to be ran, and if so, runs them. Calls to get or update the storage item's value or metadata (`getValue`, `setValue`, `removeValue`, `getMeta`, etc) will automatically wait for the migration process to finish before actually reading or writing values.

## Defining Constant Items

An alternative to `storage.defineItem`, `storage.defineConstant` is used to define constant values that **_never change_** once generated, like user IDs.

```ts
// utils/storage.ts
export const userId = storage.defineConstant<string>('local:user-id', () =>
  globalThis.crypto.randomUUID(),
);

export const installDate = storage.defineConstant<number>(
  'local:install-date',
  () => new Date().getTime(),
);

export const originalAppVersion = storage.defineConstant<string>(
  'local:original-manifest-version',
  () => browser.runtime.getManifest().version,
);
```

Then you can get the constant from storage like so:

```ts
await userId.getValue();
```

By default, constant values in storage are initialized lazily - the value isn't generated and saved to storage until you call `getValue` or `init` for the first time.

```ts
browser.runtime.onInstall.addListener(({ reason }) => {
  if (reason === 'install') {
    installDate.init();
    originalAppVersion.init();
  }
});
```

`init` is just an alias for `getValue` without a return value. In cases like this, it makes your code easier to read, defining a specific place where you expect the constant to be initialized.

:::info
You don't have to call `init`! If you never do, the value will be initialized when you call `getValue` for the first time.
:::

### Race Conditions

It's important to understand the potential for race conditions when using `storage.defineConstant`. WXT handles the race condition within a single JS context when calling `getValue` twice in a row - the value will only be initialized once.

However, if your extension, in quick succession, calls `getValue` once in the background and once in another JS context, like a content script, **_WXT doesn't attempt to handle this race condition_**.

In this case, on first install and the first time you call `getValue`, you may notice that the background and content script have different values. Next time you call `getValue`, the constant will have synced and the same value will be returned. But for that fraction of a second, you may notice two values.

Realistically though, this race condition is rare or impossible to happen:

1. The storage API is so fast it's nearly synchronous, so the timeframe for a race condition like this is very small
2. Since the background starts up before any other context, if you call `init` inside the `main` function or the `onInstall` callback, the value will likely be set before another context starts up.

This is why WXT has chosen not to handle this case.
