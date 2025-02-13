# TypeScript Configuration

When you run [`wxt prepare`](/api/cli/wxt-prepare), WXT generates a base TSConfig file for your project at `<rootDir>/.wxt/tsconfig.json`.

At a minimum, you need to create a TSConfig in your root directory that looks like this:

```jsonc
// <rootDir>/tsconfig.json
{
  "extends": ".wxt/tsconfig.json",
}
```

Or if you're in a monorepo, you may not want to extend the config. If you don't extend it, you need to add `.wxt/wxt.d.ts` to the TypeScript project:

```ts
/// <reference path="./.wxt/wxt.d.ts" />
```

## Compiler Options

To specify custom compiler options, add them in `<rootDir>/tsconfig.json`:

```jsonc
// <rootDir>/tsconfig.json
{
  "extends": ".wxt/tsconfig.json",
  "compilerOptions": {
    "jsx": "preserve",
  },
}
```

## TSConfig Paths

WXT provides a default set of path aliases.

| Alias | To            | Example                                         |
| ----- | ------------- | ----------------------------------------------- |
| `~~`  | `<rootDir>/*` | `import "~~/scripts"`                           |
| `@@`  | `<rootDir>/*` | `import "@@/scripts"`                           |
| `~`   | `<srcDir>/*`  | `import { toLowerCase } from "~/utils/strings"` |
| `@`   | `<srcDir>/*`  | `import { toLowerCase } from "@/utils/strings"` |

To add your own, DO NOT add them to your `tsconfig.json`! Instead, use the [`alias` option](/api/reference/wxt/interfaces/InlineConfig#alias) in `wxt.config.ts`.

This will add your custom aliases to `<rootDir>/.wxt/tsconfig.json` next time you run `wxt prepare`. It also adds your alias to the bundler so it can resolve imports.

```ts
import { resolve } from 'node:path';

export default defineConfig({
  alias: {
    // Directory:
    testing: resolve('utils/testing'),
    // File:
    strings: resolve('utils/strings.ts'),
  },
});
```

```ts
import { fakeTab } from 'testing/fake-objects';
import { toLowerCase } from 'strings';
```
