# `@wxt-dev/i18n`

[Changelog](https://github.com/wxt-dev/wxt/blob/main/packages/i18n/CHANGELOG.md)

`@wxt-dev/i18n` is a simple, type-safe wrapper around the `browser.i18n` APIs. It provides several benefits over the standard API:

1. Simple messages file format
2. Plural form support
3. Integrates with the [I18n Ally VS Code extension](#vscode)

It also provides several benefits over other non-web extension specific i18n packages:

1. Does not bundle localization files into every entrypoint
2. Don't need to fetch the localization files asynchronously
3. Can localize text in manifest and CSS files

However, it does have one major downside:

1. Like the `browser.i18n` API, to change the language, users must change the browser's language

> [!IMPORTANT]
> You don't have to use `wxt` to use this package - it will work in any bundler setup. See [Installation without WXT](#without-wxt) for more details.

## Installation

### With WXT

1. Install `@wxt-dev/i18n` via your package manager:

   ```sh
   pnpm i @wxt-dev/i18n
   ```

2. Add the WXT module to your `wxt.config.ts` file and setup a default locale:

   ```ts
   export default defineConfig({
     modules: ['@wxt-dev/i18n/module'],
     manifest: {
       default_locale: 'en',
     },
   });
   ```

3. Create a localization file at `<srcDir>/locales/<default_locale>.yml` or move your existing localization files there.

   ```yml
   # <srcDir>/locales/en.yml
   helloWorld: Hello world!
   ```

   > `@wxt-dev/i18n` supports the standard messages format, so if you already have localization files at `<rootDir>/public/_locale/<lang>/messages.json`, you don't need to convert them to YAML or refactor them - just move them to `<srcDir>/locales/<lang>.json` and they'll just work out of the box!

4. To get a translation, use the auto-imported `i18n` object or import it manually:

   ```ts
   import { i18n } from '#i18n';

   i18n.t('helloWorld'); // "Hello world!"
   ```

And you're done! Using WXT, you get type-safety out of the box.

### Without WXT

1. Install `@wxt-dev/i18n` via your package manager:

   ```sh
   pnpm i @wxt-dev/i18n
   ```

2. Create a messages file at `_locales/<lang>/messages.json` or move your existing translations there:

   ```json
   {
     "helloWorld": {
       "message": "Hello world!"
     }
   }
   ```

   > [!NOTE]
   > For the best DX, you should to integrate `@wxt-dev/i18n` into your build process. This enables:

   > 1. Plural forms
   > 2. Simple messages file format
   > 3. Type safety
   >
   > See [Build Integrations](#build-integrations) to set it up.

3. Create the `i18n` object, export it, and use it wherever you want!

   ```ts
   import { createI18n } from '@wxt-dev/i18n';

   export const i18n = createI18n();

   i18n.t('helloWorld'); // "Hello world!";
   ```

## Configuration

The module can be configured via the `i18n` config:

```ts
export default defineConfig({
  modules: ['@wxt-dev/i18n'],
  i18n: {
    // ...
  },
});
```

Options have JSDocs available in your editor, or you can read them in the source code: [`I18nOptions`](https://github.com/wxt-dev/wxt/blob/main/packages/i18n/src/module.ts).

## Messages File Format

> [!DANGER]
> You can only use the file format discussed on this page if you have [integrated `@wxt-dev/i18n` into your build process](#build-integrations). If you have not integrated it into your build process, you must use JSON files in the `_locales` directory, like a normal web extension.

### File Extensions

You can define your messages in several different file types:

- `.yml`
- `.yaml`
- `.json`
- `.jsonc`
- `.json5`
- `.toml`

### Nested Keys

You can have translations at the top level or nest them into groups:

```yml
ok: OK
cancel: Cancel
welcome:
  title: Welcome to XYZ
dialogs:
  confirmation:
    title: 'Are you sure?'
```

To access a nested key, use `.`:

```ts
i18n.t('ok'); // "OK"
i18n.t('cancel'); // "Cancel"
i18n.t('welcome.title'); // "Welcome to XYZ"
i18n.t('dialogs.confirmation.title'); // "Are you sure?"
```

### Substitutions

Because `@wxt-dev/i18n` is based on `browser.i18n`, you define substitutions the same way, with `$1`-`$9`:

```yml
hello: Hello $1!
order: Thanks for ordering your $1
```

#### Escapting `$`

To escape the dollar sign, put another `$` in front of it:

```yml
dollars: $$$1
```

```ts
i18n.t('dollars', ['1.00']); // "$1.00"
```

### Plural Forms

> [!WARNING]
> Plural support languages like Arabic, that have different forms for "few" or "many", is not supported right now. Feel free to open a PR if you are interested in this!

To get a different translation based on a count:

```yml
items:
  1: 1 item
  n: $1 items
```

Then you pass in the count as the second argument to `i18n.t`:

```ts
i18n.t('items', 0); // "0 items"
i18n.t('items', 1); // "1 item"
i18n.t('items', 2); // "2 items"
```

To add a custom translation for 0 items:

```yml
items:
  0: No items
  1: 1 item
  n: $1 items
```

```ts
i18n.t('items', 0); // "No items"
i18n.t('items', 1); // "1 item"
i18n.t('items', 2); // "2 items"
```

If you need to pass a custom substitution for `$1` instead of the count, just add the substitution:

```yml
items:
  0: No items
  1: $1 item
  n: $1 items
```

```ts
i18n.t('items', 0, ['Zero']); // "No items"
i18n.t('items', 1, ['One']); // "One item"
i18n.t('items', 2, ['Multiple']); // "Multiple items"
```

### Verbose Keys

`@wxt-dev/i18n` is compatible with the message format used by [`browser.i18n`](https://developer.chrome.com/docs/extensions/reference/api/i18n).

> [!IMPORTANT]
> This means if you're migrating to `@wxt-dev/i18n` and you're already using the verbose format, you don't have to change anything!

A key is treated as "verbose" when it is:

1. At the top level (not nested)
2. Only contains the following properties: `message`, `description` and/or `placeholder`

```json
{
  "appName": {
    "message": "GitHub - Better Line Counts",
    "description": "The app's name, should not be translated"
  },
  "ok": "OK",
  "deleteConfirmation": {
    "title": "Delete XYZ?",
    "message": "You cannot undo this action once taken."
  }
}
```

In this example, only `appName` is considered verbose. `deleteConfirmation` is not verbose because it contains the additional property `title`.

```ts
i18n.t('appName'); // ✅ "GitHub - Better Line Counts"
i18n.t('appName.message'); // ❌
i18n.t('ok'); // ✅ "OK"
i18n.t('deleteConfirmation'); // ❌
i18n.t('deleteConfirmation.title'); // ✅ "Delete XYZ?"
i18n.t('deleteConfirmation.message'); // ✅ "You cannot undo this action once taken."
```

If this is confusing, don't worry! With type-safety, you'll get a type error if you do it wrong. If type-safety is disabled, you'll get a runtime warning in the devtools console.

> [!WARNING]
> Using the verbose format is not recommended. I have yet to see a translation service and software that supports this format out of the box. Stick with the simple format when you can.

## Build Integrations

To use the custom messages file format, you'll need to use `@wxt-dev/i18n/build` to transform the custom format to the one expected by browsers.

### WXT

See [Installation with WXT](#with-wxt).

But TLDR, all you need is:

```ts
// wxt.config.ts
export default defineConfig({
  modules: ['@wxt-dev/i18n/module'],
});
```

Types are generated whenever you run `wxt prepare` or another build command.

### Custom

If you're not using WXT, you'll have to pre-process the localization files yourself. Here's a basic script to generate the `_locales/.../messages.json` and `wxt-i18n-structure.d.ts` files:

```ts
// build-i18n.js
import {
  parseMessagesFile,
  generateChromeMessagesFile,
  generateTypeFile,
} from '@wxt-dev/i18n/build';

// Read your localization files
const messages = {
  en: await parseMessagesFile('path/locales/en.yml'),
  de: await parseMessagesFile('path/locales/de.yml'),
  // ...
};

// Generate JSON files for the extension
await generateChromeMessagesFile('dist/_locales/en/messages.json', messages.en);
await generateChromeMessagesFile('dist/_locales/de/messages.json', messages.de);
// ...

// Generate a types file based on your default_locale
await generateTypeFile('wxt-i18n-structure.d.ts', messages.en);
```

Then run the script:

```sh
node generate-i18n.js
```

If your build tool has a dev mode, you'll also want to rerun the script whenever you change a localization file.

#### Type Safety

Once you've generated `wxt-i18n-structure.d.ts` (see the [Custom](#custom) section), you can use it to pass the generated type into `createI18n`:

```ts
import type { WxtI18nStructure } from './wxt-i18n-structure';

export const i18n = createI18n<WxtI18nStructure>();
```

And just like that, you have type safety!

## Editor Support

For better DX, you can configure your editor with plugins and extensions.

### VS Code

The [I18n Ally Extension](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) adds several features to VS Code:

- Go to translation definition
- Inline previews of text
- Hover to see other translations

You'll need to configure it the extension so it knows where your localization files are and what function represents getting a translation:

`.vscode/i18n-ally-custom-framework.yml`:

```yml
# An array of strings which contain Language Ids defined by VS Code
# You can check available language ids here: https://code.visualstudio.com/docs/languages/identifiers
languageIds:
  - typescript

# Look for t("...")
usageMatchRegex:
  - "[^\\w\\d]t\\(['\"`]({key})['\"`]"

# Disable other built-in i18n ally frameworks
monopoly: true
```

`.vscode/settings.json`:

```json
{
  "i18n-ally.localesPaths": ["src/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### Zed

As of time of writing, Aug 18, 2024, no extensions exist for Zed to add I18n support.

### Jetbrains IDEs

Install the [I18n Ally plugin](https://plugins.jetbrains.com/plugin/17212-i18n-ally). The docs are limited around their Jetbrains support, but you'll probably need to configure the plugin similar to [VS Code](#vs-code)... Not sure where the files go though.

Please open a PR if you figure it out!
