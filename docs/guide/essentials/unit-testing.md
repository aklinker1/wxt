# Unit Testing

[[toc]]

## Vitest

WXT provides first class support for Vitest for unit testing:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  plugins: [WxtVitest()],
});
```

This plugin does several things:

- Polyfills the extension API, `browser`, with an in-memory implementation using [`@webext-core/fake-browser`](https://webext-core.aklinker1.io/fake-browser/installation)
- Adds all vite config or plugins in `wxt.config.ts`
- Configures auto-imports (if enabled)
- Applies internal WXT vite plugins for things like [bundling remote code](/guide/essentials/remote-code)
- Sets up global variables provided by WXT (`import.meta.env.BROWSER`, `import.meta.env.MANIFEST_VERSION`, `import.meta.env.IS_CHROME`, etc)
- Configures aliases (`@/*`, `@@/*`, etc) so imports can be resolved

Here are real projects with unit testing setup. Look at the code and tests to see how they're written.

- [`aklinker1/github-better-line-counts`](https://github.com/aklinker1/github-better-line-counts)
- [`wxt-dev/examples`'s Vitest Example](https://github.com/wxt-dev/examples/tree/main/examples/vitest-unit-testing)

### Example Tests

This example demonstrates that you don't have to mock `browser.storage` (used by `wxt/utils/storage`) in tests - [`@webext-core/fake-browser`](https://webext-core.aklinker1.io/fake-browser/installation) implements storage in-memory so it behaves like it would in a real extension!

```ts
import { describe, it, expect } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

const accountStorage = storage.defineItem<Account>('local:account');

async function isLoggedIn(): Promise<Account> {
  const value = await accountStorage.getValue();
  return value != null;
}

describe('isLoggedIn', () => {
  beforeEach(() => {
    // See https://webext-core.aklinker1.io/fake-browser/reseting-state
    fakeBrowser.reset();
  });

  it('should return true when the account exists in storage', async () => {
    const account: Account = {
      username: '...',
      preferences: {
        // ...
      },
    };
    await accountStorage.setValue(account);

    expect(await isLoggedIn()).toBe(true);
  });

  it('should return false when the account does not exist in storage', async () => {
    await accountStorage.deleteValue();

    expect(await isLoggedIn()).toBe(false);
  });
});
```

### Mocking WXT APIs

First, you need to understand how the `#imports` module works. When WXT (and vitest) sees this import during a preprocessing step, the import is replaced with multiple imports pointing to their "real" import path.

For example, this is what your write in your source code:

```ts
// What you write
import { injectScript, createShadowRootUi } from '#imports';
```

But Vitest sees this:

```ts
import { injectScript } from 'wxt/browser';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
```

So in this case, if you wanted to mock `injectScript`, you need to pass in `"wxt/utils/inject-script"`, not `"#imports"`.

```ts
vi.mock("wxt/utils/inject-script", () => ({
  injectScript: ...
}))
```

Refer to your project's `.wxt/types/imports-module.d.ts` file to lookup real import paths for `#imports`. If the file doesn't exist, run [`wxt prepare`](/guide/essentials/config/typescript).

## Other Testing Frameworks

To use a different framework, you will likely have to disable auto-imports, setup import aliases, manually mock the extension APIs, and setup the test environment to support all of WXT's features that you use.

It is possible to do, but will require a bit more setup. Refer to Vitest's setup for an example of how to setup a test environment:

https://github.com/wxt-dev/wxt/blob/main/packages/wxt/src/testing/wxt-vitest-plugin.ts
