---
layout: blog
title: Introducing <code>#imports</code>
description: Learn how WXT's new <code>#imports</code> module works and how to use it.
authors:
  - name: Aaron Klinker
    github: aklinker1
date: 2024-12-06T14:39:00.000Z
---

WXT v0.20 introduced a new way of manually importing its APIs: **the `#imports` module**. This module was introduced to simplify import statements and provide more visibility into all the APIs WXT provides.

<!-- prettier-ignore -->
```ts
import { browser } from 'wxt/browser'; // [!code --]
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root'; // [!code --]
import { defineContentScript } from 'wxt/utils/define-content-script'; // [!code --]
import { injectScript } from 'wxt/utils/inject-script'; // [!code --]
import { // [!code ++]
  browser, createShadowRootUi, defineContentScript, injectScript // [!code ++]
} from '#imports'; // [!code ++]
```

The `#imports` module is considered a "virtual module", because the file doesn't actually exist. At build-time, imports are split into individual statements for each API:

:::code-group

```ts [What you write]
import { defineContentScript, injectScript } from '#imports';
```

```ts [What the bundler sees]
import { defineContentScript } from 'wxt/utils/define-content-script';
import { injectScript } from 'wxt/utils/inject-script';
```

:::

Think of `#imports` as a convenient way to access all of WXT's APIs from one place, without impacting performance or bundle size.

This enables better tree-shaking compared to v0.19 and below.

:::tip Need to lookup the full import path of an API?
Open up your project's `.wxt/types/imports-module.d.ts` file.
:::

## Mocking

When writing tests, you might need to mock APIs from the `#imports` module. While mocking these APIs is very easy, it may not be immediately clear how to accomplish it.

Let's look at an example using Vitest. When [configured with `wxt/testing`](/guide/essentials/unit-testing#vitest), Vitest sees the same transformed code as the bundler. That means to mock an API from `#imports`, you need to call `vi.mock` with the real import path, not `#imports`:

```ts
import { injectScript } from '#imports';
import { vi } from 'vitest';

vi.mock('wxt/utils/inject-script')
const injectScriptMock = vi.mocked(injectScript);

injectScriptMock.mockReturnValueOnce(...);
```

## Conclusion

You don't have to use `#imports` if you don't like - you can continue importing APIs from their submodules. However, using `#imports` is the recommended approach moving forwards.

- As more APIs are added, you won't have to memorize additional import paths.
- If breaking changes are made to import paths in future major versions, `#imports` won't break.

Happy Coding 😄

> P.S. Yes, this is exactly how [Nuxt's `#imports`](https://nuxt.com/docs/guide/concepts/auto-imports#explicit-imports) works! We use the exact same library, [`unimport`](https://github.com/unjs/unimport).
