# Changelog

## v0.19.27

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.26...wxt-v0.19.27)

### 🩹 Fixes

- Allow `vite-node@^3.0.0` ([#1378](https://github.com/wxt-dev/wxt/pull/1378))
- Use path triple slash directive for types that are referenced via path ([#1407](https://github.com/wxt-dev/wxt/pull/1407))
- Support `publish-browser-extension` v3.0.0 ([ac92d40](https://github.com/wxt-dev/wxt/commit/ac92d40))
- Respect `inlineConfig.mode` when setting NODE_ENV ([#1416](https://github.com/wxt-dev/wxt/pull/1416))
- Auto-import does not work when using `@vitejs/plugin-vue` alone ([#1412](https://github.com/wxt-dev/wxt/pull/1412))

### ❤️ Contributors

- Jaguar Zhou ([@aiktb](http://github.com/aiktb))
- Alec Larson ([@aleclarson](http://github.com/aleclarson))
- Aaron ([@aklinker1](http://github.com/aklinker1))
- St3h3n <st3h3n@gmail.com>
- Eli ([@lishaduck](http://github.com/lishaduck))

## v0.19.26

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.25...wxt-v0.19.26)

### 🩹 Fixes

- **context:** Deduplicate `wxt:content-script-started` ([#1364](https://github.com/wxt-dev/wxt/pull/1364))

### ❤️ Contributors

- Deniz Uğur ([@DenizUgur](http://github.com/DenizUgur))

## v0.19.25

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.24...wxt-v0.19.25)

### 🩹 Fixes

- Drop support for vite 6.0.9+ until websocket fix is finished ([8e2badc](https://github.com/wxt-dev/wxt/commit/8e2badc))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))

## v0.19.24

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.23...wxt-v0.19.24)

### 🩹 Fixes

- **init:** Remove "experimental" from bun package manager ([b150a52](https://github.com/wxt-dev/wxt/commit/b150a52))
- **web-ext:** Correctly pass `browserConsole` option to open devtools in Firefox ([#1308](https://github.com/wxt-dev/wxt/pull/1308))
- `autoMount` not working if anchor is already present ([#1350](https://github.com/wxt-dev/wxt/pull/1350))

### 🏡 Chore

- Fix typo in CLI docs ([028c601](https://github.com/wxt-dev/wxt/commit/028c601))

### ❤️ Contributors

- 1natsu ([@1natsu172](http://github.com/1natsu172))
- Paulo Pinto ([@psrpinto](https://github.com/psrpinto))
- Aaron ([@aklinker1](http://github.com/aklinker1))

## v0.19.23

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.22...wxt-v0.19.23)

### 🚀 Enhancements

- **hooks:** Move `entrypoints:resolved` before debug logs and add `entrypoints:found` ([#1292](https://github.com/wxt-dev/wxt/pull/1292))

### 🩹 Fixes

- Allow runtime registered content scripts to not have `matches` ([#1306](https://github.com/wxt-dev/wxt/pull/1306))
- Properly close readline instance on close ([#1278](https://github.com/wxt-dev/wxt/pull/1278))

### 📖 Documentation

- Sync READMEs ([27298b7](https://github.com/wxt-dev/wxt/commit/27298b7))

### 🏡 Chore

- Simplify keyboard shortcuts ([#1284](https://github.com/wxt-dev/wxt/pull/1284))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- Abhigyan Trips ([@abhigyantrips](http://github.com/abhigyantrips))

## v0.19.22

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.21...wxt-v0.19.22)

### 🩹 Fixes

- Exclude entire `import.meta.env` object from content script output ([#1267](https://github.com/wxt-dev/wxt/pull/1267))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))

## v0.19.21

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.20...wxt-v0.19.21)

### 🩹 Fixes

- Exclude skipped entrypoints from manifest ([#1265](https://github.com/wxt-dev/wxt/pull/1265))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))

## v0.19.20

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.19...wxt-v0.19.20)

### 🚀 Enhancements

- `autoMount` content script UIs ([#1210](https://github.com/wxt-dev/wxt/pull/1210))

### 🩹 Fixes

- Only show reopen browser shortcut when it can be done ([#1263](https://github.com/wxt-dev/wxt/pull/1263))
- Import entrypoint improvements ([#1207](https://github.com/wxt-dev/wxt/pull/1207))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- 1natsu ([@1natsu172](http://github.com/1natsu172))

## v0.19.19

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.18...wxt-v0.19.19)

### 🚀 Enhancements

- Keyboard shortcut to reopen the browser without restarting the dev command ([#1211](https://github.com/wxt-dev/wxt/pull/1211))

### 🩹 Fixes

- Prevent changing dev server port when reloading config ([#1241](https://github.com/wxt-dev/wxt/pull/1241))
- Ensure content scripts are registered immediately in dev mode ([#1253](https://github.com/wxt-dev/wxt/pull/1253))
- Exclude skipped entrypoints from Firefox sources zip ([#1238](https://github.com/wxt-dev/wxt/pull/1238))

### ❤️ Contributors

- Nishu ([@nishu-murmu](http://github.com/nishu-murmu))
- Aaron ([@aklinker1](http://github.com/aklinker1))

## v0.19.18

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.17...wxt-v0.19.18)

### 🩹 Fixes

- Correct `dev.reloadCommand` restriction to consider only commands with suggested keys ([#1226](https://github.com/wxt-dev/wxt/pull/1226))

### 🌊 Types

- Add overloads to `ContentScriptContext#addEventListener` for different targets ([#1245](https://github.com/wxt-dev/wxt/pull/1245))

### 🏡 Chore

- Refactor `findEntrypoints` to return all entrypoints with `skipped` set properly ([#1244](https://github.com/wxt-dev/wxt/pull/1244))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- Jaguar Zhou ([@aiktb](http://github.com/aiktb))

## v0.19.17

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.16...wxt-v0.19.17)

### 🚀 Enhancements

- New `server:created`, `server:started`, and `server:closed` hooks ([#1179](https://github.com/wxt-dev/wxt/pull/1179))

### 🩹 Fixes

- Re-initialize WXT modules correctly during development ([#1176](https://github.com/wxt-dev/wxt/pull/1176))
- ESLint config being generated when ESLint is not installed. ([#1198](https://github.com/wxt-dev/wxt/pull/1198))
- Update `vite` dependency range to support v6 ([#1215](https://github.com/wxt-dev/wxt/pull/1215))
- Automatically convert MV3 `content_security_policy` to MV2 ([#1168](https://github.com/wxt-dev/wxt/pull/1168))
- Correctly remove child elements with integrated UI remove ([#1219](https://github.com/wxt-dev/wxt/pull/1219))
- Make content script `matches` optional ([#1220](https://github.com/wxt-dev/wxt/pull/1220))

### 📖 Documentation

- Fix analyze typo in type ([#1187](https://github.com/wxt-dev/wxt/pull/1187))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- 1natsu ([@1natsu172](http://github.com/1natsu172))
- Nishu ([@nishu-murmu](https://github.com/nishu-murmu))
- Florian Metz ([@Timeraa](http://github.com/Timeraa))

## v0.19.16

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.15...wxt-v0.19.16)

### 🚀 Enhancements

- **hooks:** Add new `config:resolved` hook ([#1177](https://github.com/wxt-dev/wxt/pull/1177))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))

## v0.19.15

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.14...wxt-v0.19.15)

### 🚀 Enhancements

- Extract `wxt/storage` to its own package, `@wxt-dev/storage` ([#1129](https://github.com/wxt-dev/wxt/pull/1129))

### 🩹 Fixes

- Add "/" to `PublicPath` and `browser.runtime.getURL` ([#1171](https://github.com/wxt-dev/wxt/pull/1171))
- Add extension ID to event used to invalidate `ContentScriptContext` ([#1175](https://github.com/wxt-dev/wxt/pull/1175))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- Nishu ([@nishu-murmu](http://github.com/nishu-murmu))

## v0.19.14

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.13...wxt-v0.19.14)

### 🚀 Enhancements

- **storage:** Support storage items in batch functions ([#990](https://github.com/wxt-dev/wxt/pull/990))
- Automatically disable 'Show warning about Self-XSS when pasing code' in new chrome ([#1159](https://github.com/wxt-dev/wxt/pull/1159))

### 🩹 Fixes

- Throw when config file does not exist ([#1156](https://github.com/wxt-dev/wxt/pull/1156))

### 📖 Documentation

- Cleanup typos and broken links ([bb5ea34](https://github.com/wxt-dev/wxt/commit/bb5ea34))
- Fix typo in `popup` and `options` EntrypointOptions ([#1121](https://github.com/wxt-dev/wxt/pull/1121))

### 🏡 Chore

- **deps:** Upgrade all non-major dependencies ([#1164](https://github.com/wxt-dev/wxt/pull/1164))
- **deps:** Bump dev and non-breaking major dependencies ([#1167](https://github.com/wxt-dev/wxt/pull/1167))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- Rxliuli ([@rxliuli](http://github.com/rxliuli))
- Kongmoumou ([@kongmoumou](http://github.com/kongmoumou))
- Florian Metz ([@Timeraa](http://github.com/Timeraa))
- Bread Grocery <breadgrocery@gmail.com>

## v0.19.13

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.12...wxt-v0.19.13)

### 🚀 Enhancements

- **env:** Load env from `.env.[browser]` variants ([#1078](https://github.com/wxt-dev/wxt/pull/1078))

### 🩹 Fixes

- Don't use `#private` member variables in `ContentScriptContext` ([#1103](https://github.com/wxt-dev/wxt/pull/1103))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- Craig Slusher ([@sleekslush](http://github.com/sleekslush))

## v0.19.12

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.11...wxt-v0.19.12)

### 🚀 Enhancements

- Add support for `WXT_` environment variable prefix ([#1076](https://github.com/wxt-dev/wxt/pull/1076))
- **config:** Add `outDirTemplate` for customizing output directory structure ([#1074](https://github.com/wxt-dev/wxt/pull/1074))

### 🔥 Performance

- Replace `execa` with `nano-spawn` for smaller package size ([#1042](https://github.com/wxt-dev/wxt/pull/1042))
- Downgrade `esbuild` so a single version is shared between sub-dependencies ([#1045](https://github.com/wxt-dev/wxt/pull/1045))

### 🩹 Fixes

- Use directory name when `zip.name` and `package.json#name` are not provided ([#1028](https://github.com/wxt-dev/wxt/pull/1028))
- Ensure consistent hook execution order and add docs ([#1081](https://github.com/wxt-dev/wxt/pull/1081))

### 📖 Documentation

- Rewrite and restructure the documentation website ([#933](https://github.com/wxt-dev/wxt/pull/933))

### 🏡 Chore

- Remove email from changelog ([#1027](https://github.com/wxt-dev/wxt/pull/1027))
- **deps:** Bump magicast from 0.3.4 to 0.3.5 ([#1017](https://github.com/wxt-dev/wxt/pull/1017))
- **deps:** Bump esbuild from 0.23.0 to 0.24.0 ([#1018](https://github.com/wxt-dev/wxt/pull/1018))
- **deps:** Bump linkedom from 0.18.4 to 0.18.5 ([#1034](https://github.com/wxt-dev/wxt/pull/1034))
- **deps:** Bump execa from 9.3.1 to 9.4.0 ([#1031](https://github.com/wxt-dev/wxt/pull/1031))
- Upgrade all non-major dependencies ([#1040](https://github.com/wxt-dev/wxt/pull/1040))
- Shrink down on dependencies ([#1050](https://github.com/wxt-dev/wxt/pull/1050))
- Enable `extensionApi: chrome` in template projects ([#1083](https://github.com/wxt-dev/wxt/pull/1083))

### ❤️ Contributors

- Aaron ([@aklinker1](http://github.com/aklinker1))
- Florian Metz ([@Timeraa](http://github.com/Timeraa))
- Mezannic ([@mezannic](http://github.com/mezannic))

## v0.19.11

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.10...wxt-v0.19.11)

### 🚀 Enhancements

- **zip:** Hooks ([#993](https://github.com/wxt-dev/wxt/pull/993))
- **zip:** `wxt zip --sources` and auto sources for opera ([#1014](https://github.com/wxt-dev/wxt/pull/1014))

### 🩹 Fixes

- Reverse env files priority ([#1016](https://github.com/wxt-dev/wxt/pull/1016))
- #1005 fixed, by updating type-definations to getItem method. ([#1007](https://github.com/wxt-dev/wxt/pull/1007), [#1005](https://github.com/wxt-dev/wxt/issues/1005))

### 🏡 Chore

- Move some files around ([#996](https://github.com/wxt-dev/wxt/pull/996))

### ❤️ Contributors

- Florian Metz ([@Timeraa](http://github.com/Timeraa))
- Gurvir Singh ([@baraich](http://github.com/baraich))
- Mezannic ([@mezannic](http://github.com/mezannic))
- Aaron ([@aklinker1](http://github.com/aklinker1))

## v0.19.10

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.9...wxt-v0.19.10)

### 🔥 Performance

- Reduce hypersensitive onChange of watcher ([#978](https://github.com/wxt-dev/wxt/pull/978))

### 🩹 Fixes

- Fix config manifest type ([#973](https://github.com/wxt-dev/wxt/pull/973))

### 📖 Documentation

- Examples reference outDir vs. outputDir ([#982](https://github.com/wxt-dev/wxt/pull/982))
- Improved docs and links ([#970](https://github.com/wxt-dev/wxt/pull/970))

### 🌊 Types

- Fix `ExtensionRunnerConfig.chromiumPref` type ([fda1e18](https://github.com/wxt-dev/wxt/commit/fda1e18))

### ❤️ Contributors

- 1natsu ([@1natsu172](http://github.com/1natsu172))
- Okinea Dev ([@okineadev](http://github.com/okineadev))
- The-syndrome <meltdown-syndrome@proton.me>
- Hikiko4ern ([@hikiko4ern](http://github.com/hikiko4ern))

## v0.19.9

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.8...wxt-v0.19.9)

### 🚀 Enhancements

- **modules:** Add `wxt.hook` alias for `wxt.hooks.hook` ([c5f78d0](https://github.com/wxt-dev/wxt/commit/c5f78d0))
- Use `@types/chrome` for config manifest type ([#969](https://github.com/wxt-dev/wxt/pull/969))

### 🩹 Fixes

- Allow adding multiple hyphens in an entrypoint name ([#949](https://github.com/wxt-dev/wxt/pull/949))
- Duplicate `BuildOutput.publicAssets` ([#951](https://github.com/wxt-dev/wxt/pull/951))
- Properly overload `import.meta.env` with WXT's own environment globals ([#966](https://github.com/wxt-dev/wxt/pull/966))

### 📖 Documentation

- Add docs around `importEntrypoint` to relevant functions ([143b5ac](https://github.com/wxt-dev/wxt/commit/143b5ac))

### 🌊 Types

- **modules:** Use `NestedHooks` instead of `Partial` for hooks object ([0ebb013](https://github.com/wxt-dev/wxt/commit/0ebb013))

### 🏡 Chore

- Fix type error ([#946](https://github.com/wxt-dev/wxt/pull/946))
- Add  `oxlint` for linting ([#947](https://github.com/wxt-dev/wxt/pull/947))
- **deps:** Bump ora from 8.0.1 to 8.1.0 ([#961](https://github.com/wxt-dev/wxt/pull/961))
- **deps:** Bump unimport from 3.9.1 to 3.11.1 ([#960](https://github.com/wxt-dev/wxt/pull/960))
- **deps:** Bump execa from 9.3.0 to 9.3.1 ([#957](https://github.com/wxt-dev/wxt/pull/957))
- Cleanup leftover E2E test artifacts ([#968](https://github.com/wxt-dev/wxt/pull/968))

### ❤️ Contributors

- 1natsu ([@1natsu172](http://github.com/1natsu172))

## v0.19.8

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.7...wxt-v0.19.8)

### 🔥 Performance

- Ignore output directories for all `vite.watcher` ([#924](https://github.com/wxt-dev/wxt/pull/924))

### 🩹 Fixes

- Fallback to GitHub API for listing templates when ungh is down ([#944](https://github.com/wxt-dev/wxt/pull/944))

### 🏡 Chore

- **types:** Cleanup types in wxt/browser/chrome ([#932](https://github.com/wxt-dev/wxt/pull/932))

### ❤️ Contributors

- 1natsu

## v0.19.7

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.6...wxt-v0.19.7)

### 🚀 Enhancements

- **testing:** Run WXT modules when setting up test environment ([#926](https://github.com/wxt-dev/wxt/pull/926))
- **modules:** Add `addAlias` helper ([#928](https://github.com/wxt-dev/wxt/pull/928))

### 🩹 Fixes

- **testing:** Stub `chrome` and `browser` globals with `fakeBrowser` automatically ([#925](https://github.com/wxt-dev/wxt/pull/925))
- Ensure TSConfig paths start with `../` or  `./` so they are valid ([#927](https://github.com/wxt-dev/wxt/pull/927))

### 📖 Documentation

- Fix module name for `wxt/browser/chrome` ([751706d](https://github.com/wxt-dev/wxt/commit/751706d))

### 🏡 Chore

- Remove warning log for missing public directory ([5f2e1c3](https://github.com/wxt-dev/wxt/commit/5f2e1c3))

## v0.19.6

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.5...wxt-v0.19.6)

### 🔥 Performance

- Ignore non-source code from the file watcher ([#919](https://github.com/wxt-dev/wxt/pull/919))

### 🩹 Fixes

- Typo in sidepanel options (`browse_style` → `browser_style`) ([#914](https://github.com/wxt-dev/wxt/pull/914))
- **types:** Don't report type errors when using string templates with `browser.i18n.getMessage` ([#916](https://github.com/wxt-dev/wxt/pull/916))

### ❤️ Contributors

- 1natsu ([@1natsu](https://github.com/1natsu172))

## v0.19.5

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.4...wxt-v0.19.5)

### 🚀 Enhancements

- Allow zipping hidden files by listing them explicitly in `includeSources` ([#902](https://github.com/wxt-dev/wxt/pull/902))
- Allow excluding files when zipping ([#906](https://github.com/wxt-dev/wxt/pull/906))

### 🩹 Fixes

- #907 move wxt devDeps execa to dependencies ([#908](https://github.com/wxt-dev/wxt/pull/908), [#907](https://github.com/wxt-dev/wxt/issues/907))
- Update chromium setting for enabling content script sourcemaps ([e6529e6](https://github.com/wxt-dev/wxt/commit/e6529e6))

### ❤️ Contributors

- 1natsu ([@1natsu](https://github.com/1natsu172))
- Florian Metz ([@Timeraa](http://github.com/Timeraa))
- Hikiko4ern ([@hikiko4ern](http://github.com/hikiko4ern))

## v0.19.4

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.3...wxt-v0.19.4)

### 🚀 Enhancements

- Add `injectScript` helper ([#900](https://github.com/wxt-dev/wxt/pull/900))

### 🩹 Fixes

- Do not clear `.wxt/tsconfig.json` in `findEntrypoints` if it exists ([#898](https://github.com/wxt-dev/wxt/pull/898))
- **types:** `PublicPath` type resolution with `extensionApi: "chrome"` ([#901](https://github.com/wxt-dev/wxt/pull/901))
- Fix `createIframeUi` `page` option types ([3a8e613](https://github.com/wxt-dev/wxt/commit/3a8e613))

### ❤️ Contributors

- Hikiko4ern ([@hikiko4ern](http://github.com/hikiko4ern))

## v0.19.3

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.2...wxt-v0.19.3)

### 🩹 Fixes

- Add `consola` to `wxt` dependencies ([#892](https://github.com/wxt-dev/wxt/pull/892))
- **content-script-context:** Fix initialization logic for Firefox ([#895](https://github.com/wxt-dev/wxt/pull/895))

### 📖 Documentation

- Improve `prepare:types` hook JSDoc ([#886](https://github.com/wxt-dev/wxt/pull/886))

### ❤️ Contributors

- Hikiko4ern ([@hikiko4ern](http://github.com/hikiko4ern))
- Himanshu Patil ([@mehimanshupatil](https://github.com/mehimanshupatil))

## v0.19.2

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.1...wxt-v0.19.2)

### 🩹 Fixes

- Remove unused top-level functions and variables when loading entrypoints with the `vite-node` loader ([#875](https://github.com/wxt-dev/wxt/pull/875))
- Don't default to dev mode for production builds when using `vite-node` loader ([#877](https://github.com/wxt-dev/wxt/pull/877))

### 📖 Documentation

- Update README and homepage features with WXT modules ([ed07a49](https://github.com/wxt-dev/wxt/commit/ed07a49))

### 🏡 Chore

- **deps:** Upgrade all dependencies ([#869](https://github.com/wxt-dev/wxt/pull/869))

## v0.19.1

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.19.0...wxt-v0.19.1)

### 🚀 Enhancements

- Auto Icons Module ([#851](https://github.com/wxt-dev/wxt/pull/851))

### 🔥 Performance

- Tree-shake unrelated code inside `vite-node` entrypoint loader ([#867](https://github.com/wxt-dev/wxt/pull/867))

### 🩹 Fixes

- Define web globals when importing entrypoints ([#865](https://github.com/wxt-dev/wxt/pull/865))

### ❤️ Contributors

- Florian Metz ([@Timeraa](http://github.com/Timeraa))

## v0.19.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.15...wxt-v0.19.0)

### 🚀 Enhancements

- **experimental:** First-class support for excluding `webextension-polyfill` ([#847](https://github.com/wxt-dev/wxt/pull/847))
- **storage:** `init` option and rename `defaultValue` to `fallback` ([#827](https://github.com/wxt-dev/wxt/pull/827))
- **hooks:** Add `prepare:publicPaths` hook ([#858](https://github.com/wxt-dev/wxt/pull/858))
- ⚠️  Use `vite-node` to load entrypoints by default ([#859](https://github.com/wxt-dev/wxt/pull/859))

### 🔥 Performance

- **size:** ⚠️  Switch from `tsup` to `unbuild` for building WXT ([#848](https://github.com/wxt-dev/wxt/pull/848))

### 🩹 Fixes

- Wrong module hook type ([#849](https://github.com/wxt-dev/wxt/pull/849))

### 📖 Documentation

- Update labels in content script UI positioning screenshot ([2b6ff8d](https://github.com/wxt-dev/wxt/commit/2b6ff8d))
- Add upgrade guide and breaking changes ([#860](https://github.com/wxt-dev/wxt/pull/860))

### 🏡 Chore

- **deps:** Bump all non-major dependencies ([#834](https://github.com/wxt-dev/wxt/pull/834))
- **dev-deps:** Upgrade `vitest` from 1.6 to 2.0 ([#836](https://github.com/wxt-dev/wxt/pull/836))
- **deps:** Upgrade `async-mutex` from 0.4.1 to 0.5.0 ([#837](https://github.com/wxt-dev/wxt/pull/837))
- **deps:** Upgrade `esbuild` from 0.19.12 to 0.23.0 ([#838](https://github.com/wxt-dev/wxt/pull/838))
- **deps:** Upgrade `vite-node` from 1.6 to 2.0 ([#839](https://github.com/wxt-dev/wxt/pull/839))
- **deps:** Upgrade `ora` from 7 to 8 ([#841](https://github.com/wxt-dev/wxt/pull/841))
- **deps:** Upgrade `webextension-polyfill` from 0.10 to 0.12 ([#842](https://github.com/wxt-dev/wxt/pull/842))
- **deps:** Upgrade `minimatch` from 9 to 10 ([#840](https://github.com/wxt-dev/wxt/pull/840))
- **dev-deps:** Upgrade `happy-dom` from 13 to 14 ([#843](https://github.com/wxt-dev/wxt/pull/843))

### ❤️ Contributors

- Florian Metz ([@Timeraa](http://github.com/Timeraa))

## v0.18.15

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.14...wxt-v0.18.15)

### 🩹 Fixes

- Don't throw error if localization file is missing ([#832](https://github.com/wxt-dev/wxt/pull/832))
- Build latest version of package before packing ([88a1244](https://github.com/wxt-dev/wxt/commit/88a1244))
- Externalize app config during dependency optimization ([#833](https://github.com/wxt-dev/wxt/pull/833))

### 📖 Documentation

- Fix links to Guide pages ([#821](https://github.com/wxt-dev/wxt/pull/821))

### ❤️ Contributors

- Eetann ([@eetann](http://github.com/eetann))

## v0.18.14

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.13...wxt-v0.18.14)

### 🩹 Fixes

- **modules:** Add types from all wxt node_modules, not just ones with config ([#817](https://github.com/wxt-dev/wxt/pull/817))

## v0.18.13

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.12...wxt-v0.18.13)

### 🚀 Enhancements

- **config:** `dev.server.hostname` ([#807](https://github.com/wxt-dev/wxt/pull/807))
- Add XPath support to getAnchor() ([#813](https://github.com/wxt-dev/wxt/pull/813))

### 🩹 Fixes

- Add debug logs for vite builder ([#816](https://github.com/wxt-dev/wxt/pull/816))

### ❤️ Contributors

- Ayub Kokabi ([@sir-kokabi](http://github.com/sir-kokabi))

## v0.18.12

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.11...wxt-v0.18.12)

### 🚀 Enhancements

- Support runtime config in `app.config.ts` ([#792](https://github.com/wxt-dev/wxt/pull/792))

### 🔥 Performance

- Create zip using streams ([#793](https://github.com/wxt-dev/wxt/pull/793))

### 🩹 Fixes

- Add missing name to ESLint v9 autoImports config ([#801](https://github.com/wxt-dev/wxt/pull/801))

### 📖 Documentation

- Update README ([#802](https://github.com/wxt-dev/wxt/pull/802))

### 🏡 Chore

- **deps:** Upgrade `web-ext-run` (0.2.0 to 0.2.1) ([#804](https://github.com/wxt-dev/wxt/pull/804))

### ❤️ Contributors

- Ntnyq ([@ntnyq](http://github.com/ntnyq))
- Florian Metz ([@Timeraa](http://github.com/Timeraa))

## v0.18.11

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.10...wxt-v0.18.11)

### 🚀 Enhancements

- Add eslint 9 config support ([#762](https://github.com/wxt-dev/wxt/pull/762))

### 🩹 Fixes

- Respect custom `outDir` when cleaning and zipping ([#774](https://github.com/wxt-dev/wxt/pull/774))
- **dev:** Catch error when attempting to reload a tab in a saved tab group ([#786](https://github.com/wxt-dev/wxt/pull/786))

### 🏡 Chore

- Replace consola with wxt.logger ([#776](https://github.com/wxt-dev/wxt/pull/776))
- **deps:** Upgrade non-major deps ([#778](https://github.com/wxt-dev/wxt/pull/778))

### ❤️ Contributors

- KnightYoshi ([@KnightYoshi](http://github.com/KnightYoshi))
- Asakura Mizu ([@AsakuraMizu](http://github.com/AsakuraMizu))

## v0.18.10

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.9...wxt-v0.18.10)

### 🚀 Enhancements

- Add `prepare:types` hook to extend `.wxt/` directory generation ([#767](https://github.com/wxt-dev/wxt/pull/767))
- **modules:** Allow adding generated public files ([#769](https://github.com/wxt-dev/wxt/pull/769))

### 🩹 Fixes

- Await `prepare:types` hook ([b29d49c](https://github.com/wxt-dev/wxt/commit/b29d49c))

### 🏡 Chore

- Refactor package manager test fixtures ([39f6c29](https://github.com/wxt-dev/wxt/commit/39f6c29))
- Consolidate `unimport` code into a built-in module ([#771](https://github.com/wxt-dev/wxt/pull/771))

## v0.18.9

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.8...wxt-v0.18.9)

### 🚀 Enhancements

- **experimental:** Replace `viteRuntime` option with `entrypointImporter` option, and implement `vite-node` importer ([#761](https://github.com/wxt-dev/wxt/pull/761))

## v0.18.8

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.7...wxt-v0.18.8)

### 🚀 Enhancements

- **dev:** Reload extension when public files change ([#752](https://github.com/wxt-dev/wxt/pull/752))

### 🩹 Fixes

- Don't load plugins twice in HTML pages ([#746](https://github.com/wxt-dev/wxt/pull/746))
- Ignore .wxt file changes in dev ([#755](https://github.com/wxt-dev/wxt/pull/755))
- **modules:** `addViteConfig` ignored user vite config ([#760](https://github.com/wxt-dev/wxt/pull/760))

### 🏡 Chore

- Refactor client web socket util ([#753](https://github.com/wxt-dev/wxt/pull/753))
- Add E2E test for `addImportPreset` ([9fc6408](https://github.com/wxt-dev/wxt/commit/9fc6408))

## v0.18.7

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.6...wxt-v0.18.7)

### 🩹 Fixes

- **dev:** Fix CSP error loading HTML plugins ([#723](https://github.com/wxt-dev/wxt/pull/723))
- Generalize react-refresh preamble logic to virtualize all inline scripts ([#728](https://github.com/wxt-dev/wxt/pull/728))
- **zip:** Revert dotfile changes from #674 ([#742](https://github.com/wxt-dev/wxt/pull/742), [#674](https://github.com/wxt-dev/wxt/issues/674))

### 🏡 Chore

- **deps:** Upgrade and sync all dependencies ([#725](https://github.com/wxt-dev/wxt/pull/725))
- Extract build cache script to NPM package ([#737](https://github.com/wxt-dev/wxt/pull/737))

## v0.18.6

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.5...wxt-v0.18.6)

### 🚀 Enhancements

- **modules:** Add new `addImportPreset` helper function ([#720](https://github.com/wxt-dev/wxt/pull/720))

### 🩹 Fixes

- **types:** Module `options` param is optional, but types did not reflect that ([#719](https://github.com/wxt-dev/wxt/pull/719))
- **modules:** Re-export `WxtModule` type from `wxt/modules` to prevent TS2742 ([#721](https://github.com/wxt-dev/wxt/pull/721))
- **modules:** Add modules to TS project so type augmentation works ([#722](https://github.com/wxt-dev/wxt/pull/722))

### 🏡 Chore

- **dev-deps:** Upgrade typescript to 5.4 ([#718](https://github.com/wxt-dev/wxt/pull/718))

## v0.18.5

[compare changes](https://github.com/wxt-dev/wxt/compare/wxt-v0.18.4...wxt-v0.18.5)

### 🚀 Enhancements

- Module system ([#672](https://github.com/wxt-dev/wxt/pull/672))

### 🩹 Fixes

- To fix the issue with Entrypoint Side Effects link errors ([#705](https://github.com/wxt-dev/wxt/pull/705))
- **storage:** Add storage area typing for storage keys ([#708](https://github.com/wxt-dev/wxt/pull/708))

### 📖 Documentation

- Restructure wxt.dev ([#701](https://github.com/wxt-dev/wxt/pull/701))
- Add eslintrc info to auto-imports page ([454b076](https://github.com/wxt-dev/wxt/commit/454b076))

### 🏡 Chore

- **deps:** Bump linkedom from 0.16.8 to 0.18.2 ([#690](https://github.com/wxt-dev/wxt/pull/690))
- **deps:** Bump nypm from 0.3.6 to 0.3.8 ([#692](https://github.com/wxt-dev/wxt/pull/692))
- **deps-dev:** Bump tsx from 4.7.0 to 4.11.2 ([#699](https://github.com/wxt-dev/wxt/pull/699))
- **deps-dev:** Bump execa from 8.0.1 to 9.1.0 ([#691](https://github.com/wxt-dev/wxt/pull/691))
- Fix flakey TS config ([a257217](https://github.com/wxt-dev/wxt/commit/a257217))
- Remove log in tests ([eb3b9bc](https://github.com/wxt-dev/wxt/commit/eb3b9bc))
- **deps:** Upgrade braces to 3.0.3 ([#711](https://github.com/wxt-dev/wxt/pull/711))

### 🤖 CI

- Add support for managing multiple changelogs ([#712](https://github.com/wxt-dev/wxt/pull/712))

### ❤️ Contributors

- TheOnlyTails ([@TheOnlyTails](http://github.com/TheOnlyTails))
- Rxliuli ([@rxliuli](http://github.com/rxliuli))

## v0.18.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.18.3...v0.18.4)

### 🩹 Fixes

- Allow zipping hidden files in sources by listing them explicitly in `includeSources` ([#674](https://github.com/wxt-dev/wxt/pull/674))
- Properly invalidate content script context ([#683](https://github.com/wxt-dev/wxt/pull/683))

### 📖 Documentation

- Update contributing guidelines ([8125d74](https://github.com/wxt-dev/wxt/commit/8125d74))

### ❤️ Contributors

- Hujiulong ([@hujiulong](http://github.com/hujiulong))

## v0.18.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.18.2...v0.18.3)

### 🩹 Fixes

- Automatically add dev server to sandbox CSP ([#663](https://github.com/wxt-dev/wxt/pull/663))
- Remove `import * as` imports from entrypoints during build ([#671](https://github.com/wxt-dev/wxt/pull/671))
- **security:** Upgrade tar to 6.2.1 ([215def7](https://github.com/wxt-dev/wxt/commit/215def7))

### 📖 Documentation

- Add YTBlock to homepage ([#666](https://github.com/wxt-dev/wxt/pull/666))

### 🏡 Chore

- Add missing tests for dev mode CSP ([#662](https://github.com/wxt-dev/wxt/pull/662))
- Upgrade templates to v0.18 ([3b954cc](https://github.com/wxt-dev/wxt/commit/3b954cc))

### 🤖 CI

- Fix sync-releases workflow trigger ([5d8efef](https://github.com/wxt-dev/wxt/commit/5d8efef))

### ❤️ Contributors

- Edoan ([@EdoanR](http://github.com/EdoanR))

## v0.18.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.18.1...v0.18.2)

### 🚀 Enhancements

- **runner:** Add `keepProfileChanges` option ([#655](https://github.com/wxt-dev/wxt/pull/655))

### 🩹 Fixes

- Automatically detect and add "sidePanel" permission ([5fcaf7c](https://github.com/wxt-dev/wxt/commit/5fcaf7c))

### 📖 Documentation

- Fix `wxt-vitest-plugin` reference ([#650](https://github.com/wxt-dev/wxt/pull/650))
- Fix spelling mistake in remote-code.md ([#652](https://github.com/wxt-dev/wxt/pull/652))
- Correct event handler name in handling-updates.md ([#653](https://github.com/wxt-dev/wxt/pull/653))
- Fix iframe typos ([c74e530](https://github.com/wxt-dev/wxt/commit/c74e530))

### ❤️ Contributors

- Edoan ([@EdoanR](http://github.com/EdoanR))
- Linus Norton ([@linusnorton](http://github.com/linusnorton))
- Jeffrey Zang ([@jeffrey-zang](http://github.com/jeffrey-zang))
- Emmanuel Ferdman ([@emmanuel-ferdman](https://github.com/emmanuel-ferdman))

## v0.18.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.18.0...v0.18.1)

### 🩹 Fixes

- `_background` is not defined ([#649](https://github.com/wxt-dev/wxt/pull/649))

### 🏡 Chore

- Add root README back ([ec3dd52](https://github.com/wxt-dev/wxt/commit/ec3dd52))

### 🤖 CI

- Fix sync releases workflow ([dc5b55b](https://github.com/wxt-dev/wxt/commit/dc5b55b))

## v0.18.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.12...v0.18.0)

### 🚀 Enhancements

- Add zip compression settings ([#605](https://github.com/wxt-dev/wxt/pull/605))
- Support returning values from scripts executed with the scripting API ([#624](https://github.com/wxt-dev/wxt/pull/624))
- **experimental:** Load entrypoint options with Vite Runtime API ([#648](https://github.com/wxt-dev/wxt/pull/648))

### 🩹 Fixes

- ⚠️ Automatically move `host_permissions` to `permissions` for MV2 ([#626](https://github.com/wxt-dev/wxt/pull/626))
- **dep:** Upgrade `@webext-core/isolated-element` to v1.1.2 ([#625](https://github.com/wxt-dev/wxt/pull/625))

### 📖 Documentation

- Add Fluent Read to homepage ([#600](https://github.com/wxt-dev/wxt/pull/600))
- Fix typo on example for wxt.config.ts. ([#609](https://github.com/wxt-dev/wxt/pull/609))
- Tix typo in `entrypoints.md` ([#614](https://github.com/wxt-dev/wxt/pull/614))
- Add Facebook Video Controls to homepage ([#615](https://github.com/wxt-dev/wxt/pull/615))
- Fix typo in assets page ([a94d673](https://github.com/wxt-dev/wxt/commit/a94d673))
- Add ElemSnap to homepage ([#621](https://github.com/wxt-dev/wxt/pull/621))
- Update content script registration JSDoc ([e47519f](https://github.com/wxt-dev/wxt/commit/e47519f))
- Add docs about handling updates ([acb7554](https://github.com/wxt-dev/wxt/commit/acb7554))
- Add MS Edge TTS to homepage ([#647](https://github.com/wxt-dev/wxt/pull/647))
- Document required permission for storage API ([#632](https://github.com/wxt-dev/wxt/pull/632))

### 🏡 Chore

- Update vue template config ([#607](https://github.com/wxt-dev/wxt/pull/607))
- **deps-dev:** Bump lint-staged from 15.2.1 to 15.2.2 ([#637](https://github.com/wxt-dev/wxt/pull/637))
- **deps-dev:** Bump publint from 0.2.6 to 0.2.7 ([#639](https://github.com/wxt-dev/wxt/pull/639))
- **deps-dev:** Bump simple-git-hooks from 2.9.0 to 2.11.1 ([#640](https://github.com/wxt-dev/wxt/pull/640))
- Refactor repo to a standard monorepo ([#646](https://github.com/wxt-dev/wxt/pull/646))
- Fix formatting after monorepo refactor ([6ca3767](https://github.com/wxt-dev/wxt/commit/6ca3767))

### ❤️ Contributors

- Alegal200 ([@alegal200](https://github.com/alegal200))
- Yacine-bens ([@yacine-bens](http://github.com/yacine-bens))
- Ayden ([@AydenGen](https://github.com/AydenGen))
- Wuzequanyouzi ([@wuzequanyouzi](http://github.com/wuzequanyouzi))
- Can Rau ([@CanRau](http://github.com/CanRau))
- 日高 凌 ([@ryohidaka](http://github.com/ryohidaka))
- Bas Van Zanten ([@Bas950](http://github.com/Bas950))
- ThinkStu ([@Bistutu](http://github.com/Bistutu))

## v0.17.12

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.11...v0.17.12)

### 🚀 Enhancements

- Add hooks for extending vite config ([#599](https://github.com/wxt-dev/wxt/pull/599))

### 🩹 Fixes

- **content-script-ui:** Properly assign and unassign mounted value ([#598](https://github.com/wxt-dev/wxt/pull/598))

### 📖 Documentation

- Add discord server link ([#593](https://github.com/wxt-dev/wxt/pull/593))

### 🏡 Chore

- Remove unnecssary 'Omit' types ([db57c8e](https://github.com/wxt-dev/wxt/commit/db57c8e))
- **deps-dev:** Bump @aklinker1/check from 1.1.1 to 1.2.0 ([#588](https://github.com/wxt-dev/wxt/pull/588))
- **deps-dev:** Bump vue from 3.3.10 to 3.4.21 ([#589](https://github.com/wxt-dev/wxt/pull/589))
- **deps-dev:** Bump sass from 1.69.5 to 1.72.0 ([#591](https://github.com/wxt-dev/wxt/pull/591))

## v0.17.11

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.10...v0.17.11)

### 🩹 Fixes

- Resolve absolute paths from the public directory properly ([#583](https://github.com/wxt-dev/wxt/pull/583))

### 📖 Documentation

- Fix `zip.includeSources` example ([16fc584](https://github.com/wxt-dev/wxt/commit/16fc584))
- Add "GitHub Custom Notifier" to homepage ([#580](https://github.com/wxt-dev/wxt/pull/580))

### 🏡 Chore

- Simplify virtual module setup ([#581](https://github.com/wxt-dev/wxt/pull/581))
- Add some array utils ([#582](https://github.com/wxt-dev/wxt/pull/582))
- Extract helper function ([d3b14af](https://github.com/wxt-dev/wxt/commit/d3b14af))

### ❤️ Contributors

- Qiwei Yang ([@qiweiii](http://github.com/qiweiii))

## v0.17.10

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.9...v0.17.10)

### 🚀 Enhancements

- Add `dev.server.port` config ([#577](https://github.com/wxt-dev/wxt/pull/577))

### 🏡 Chore

- Use `@aklinker1/check` to simplify checks setup ([#550](https://github.com/wxt-dev/wxt/pull/550))
- Refactor order of config resolution ([#578](https://github.com/wxt-dev/wxt/pull/578))

### ❤️ Contributors

- Zizheng Tai ([@zizhengtai](http://github.com/zizhengtai))

## v0.17.9

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.8...v0.17.9)

### 🚀 Enhancements

- Add `{{mode}}` Template Variable ([#566](https://github.com/wxt-dev/wxt/pull/566))

### 🩹 Fixes

- Don't override `wxt.config.ts` options when CLI flags are not passed ([#567](https://github.com/wxt-dev/wxt/pull/567))

### 🏡 Chore

- Merge user config using `defu` ([#568](https://github.com/wxt-dev/wxt/pull/568))

### ❤️ Contributors

- Guillaume ([@GuiEpi](http://github.com/GuiEpi))

## v0.17.8

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.7...v0.17.8)

### 🚀 Enhancements

- **analysis:** Open `stats.html` file automatically ([#564](https://github.com/wxt-dev/wxt/pull/564))

### 🩹 Fixes

- **init:** Better error logging when templates fail to load ([b47c150](https://github.com/wxt-dev/wxt/commit/b47c150))
- Remove deprecated extension from Vue template ([#534](https://github.com/wxt-dev/wxt/pull/534))
- Append option description error ([#546](https://github.com/wxt-dev/wxt/pull/546))
- **init:** Don't overwrite existing files when initializing a new project ([#556](https://github.com/wxt-dev/wxt/pull/556))
- **dev:** Don't crash dev mode when rebuild fails ([#565](https://github.com/wxt-dev/wxt/pull/565))

### 📖 Documentation

- Replace `pnpx` with `pnpm dlx` ([#527](https://github.com/wxt-dev/wxt/pull/527))
- Update homepage demo video ([35269da](https://github.com/wxt-dev/wxt/commit/35269da))
- Update README demo video ([#539](https://github.com/wxt-dev/wxt/pull/539))
- Add Plex skipper to "Using WXT" section ([#541](https://github.com/wxt-dev/wxt/pull/541))
- Add documentation for Bun.sh ([#543](https://github.com/wxt-dev/wxt/pull/543))
- Mention adding unlisted scripts and pages to `web_accessible_resources` ([121b521](https://github.com/wxt-dev/wxt/commit/121b521))
- Add examples for GitHub Actions ([#540](https://github.com/wxt-dev/wxt/pull/540))
- Fixed "Reload the Extension" section ([#559](https://github.com/wxt-dev/wxt/pull/559))

### 🏡 Chore

- Increase unit test timeout ([d9cba55](https://github.com/wxt-dev/wxt/commit/d9cba55))
- Increase hook timeout for Windows/NPM tests ([56b7149](https://github.com/wxt-dev/wxt/commit/56b7149))
- Switch to seed plugin for testing ([#547](https://github.com/wxt-dev/wxt/pull/547))
- **vue-template:** Upgrade to `vue-tsc` v2 ([#549](https://github.com/wxt-dev/wxt/pull/549))
- Add a test covering `wxt init` in a non-empty directory ([#563](https://github.com/wxt-dev/wxt/pull/563))

### ❤️ Contributors

- Btea ([@btea](http://github.com/btea))
- Vlad Fedosov ([@StyleT](http://github.com/StyleT))
- Lpmvb ([@Lpmvb](http://github.com/Lpmvb))
- Guillaume ([@GuiEpi](http://github.com/GuiEpi))
- Sunshio ([@MPB-Tech](http://github.com/MPB-Tech))
- Luca Dalli ([@lucadalli](http://github.com/lucadalli))

## v0.17.7

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.6...v0.17.7)

### 🩹 Fixes

- **zip:** List `.wxt/local_modules` overrides relative to the `package.json` they're added to ([#526](https://github.com/wxt-dev/wxt/pull/526))

### 🏡 Chore

- Bump templates to v0.17 ([#524](https://github.com/wxt-dev/wxt/pull/524))
- Increase test timeout for windows NPM tests ([#525](https://github.com/wxt-dev/wxt/pull/525))

## v0.17.6

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.5...v0.17.6)

### 🚀 Enhancements

- Add warnings when important directories are missing ([#516](https://github.com/wxt-dev/wxt/pull/516))
- Automatically remove top-level MV2-only or MV3-only keys ([#518](https://github.com/wxt-dev/wxt/pull/518))
- Automatically generate `browser_action` based on `action` for MV2 ([#519](https://github.com/wxt-dev/wxt/pull/519))

### 🩹 Fixes

- **zip:** List all private packages correctly in a PNPM workspace ([#520](https://github.com/wxt-dev/wxt/pull/520))

### 📖 Documentation

- Mentions moving folders into `srcDir` ([9cd4e83](https://github.com/wxt-dev/wxt/commit/9cd4e83))

### 🏡 Chore

- **deps-dev:** Bump @types/react from 18.2.34 to 18.2.61 ([#510](https://github.com/wxt-dev/wxt/pull/510))

## v0.17.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.4...v0.17.5)

### 🚀 Enhancements

- Expose package management utils under `wxt.pm` ([#502](https://github.com/wxt-dev/wxt/pull/502))
- Download and override private packages for Firefox code review ([#507](https://github.com/wxt-dev/wxt/pull/507))

### 📖 Documentation

- Fix typos ([#503](https://github.com/wxt-dev/wxt/pull/503))
- Add docs about configuring the manifest as a function ([195d2cc](https://github.com/wxt-dev/wxt/commit/195d2cc))
- Fix CLI generation ([b754435](https://github.com/wxt-dev/wxt/commit/b754435))

### 🏡 Chore

- Use JSZip for `wxt zip`, enabling future features ([#501](https://github.com/wxt-dev/wxt/pull/501))

### ❤️ Contributors

- Btea ([@btea](http://github.com/btea))

## v0.17.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.3...v0.17.4)

### 🚀 Enhancements

- Add basic content script to templates ([#495](https://github.com/wxt-dev/wxt/pull/495))
- Add `ResolvedConfig.wxtModuleDir`, resolving the directory once ([#497](https://github.com/wxt-dev/wxt/pull/497))

### 🩹 Fixes

- Resolve the path to `node_modules/wxt` correctly ([#498](https://github.com/wxt-dev/wxt/pull/498))

### 📖 Documentation

- Added DocVersionRedirector to "Using WXT" section ([#492](https://github.com/wxt-dev/wxt/pull/492))
- Fix typos ([f80fb42](https://github.com/wxt-dev/wxt/commit/f80fb42))
- Add CRXJS to comparison page ([cb4f9aa](https://github.com/wxt-dev/wxt/commit/cb4f9aa))
- Update comparison page ([35778f7](https://github.com/wxt-dev/wxt/commit/35778f7))
- Update context usage ([012bd7e](https://github.com/wxt-dev/wxt/commit/012bd7e))
- Add testing example for `ContentScriptContext` ([e1c6020](https://github.com/wxt-dev/wxt/commit/e1c6020))

### 🏡 Chore

- Fix tests after template change ([f9b0aa4](https://github.com/wxt-dev/wxt/commit/f9b0aa4))

### ❤️ Contributors

- Btea ([@btea](http://github.com/btea))
- Leo Shklovskii <leo@thermopylae.net>

## v0.17.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.2...v0.17.3)

### 🚀 Enhancements

- **storage:** Guarantee `storage.getItems` returns values in the same order as requested ([b5f4d8c](https://github.com/wxt-dev/wxt/commit/b5f4d8c))

### 🩹 Fixes

- Content scripts crash when using `storage.defineItem` ([77e6d1f](https://github.com/wxt-dev/wxt/commit/77e6d1f))
- **storage:** Revert #478 and run migrations when item is defined and properly wait for migrations before allowing read/writes ([#487](https://github.com/wxt-dev/wxt/pull/487), [#478](https://github.com/wxt-dev/wxt/issues/478))

## v0.17.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.1...v0.17.2)

### 🩹 Fixes

- Don't use sub-dependency binaries directly ([#482](https://github.com/wxt-dev/wxt/pull/482))

## v0.17.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.17.0...v0.17.1)

### 🩹 Fixes

- Content scripts not loading in dev mode ([3fbbe2c](https://github.com/wxt-dev/wxt/commit/3fbbe2c))

### 📖 Documentation

- Lots of small typo fixes ([#480](https://github.com/wxt-dev/wxt/pull/480))

### ❤️ Contributors

- Leo Shklovskii ([@leos](https://github.com/leos))

## v0.17.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.11...v0.17.0)

### 🚀 Enhancements

- **storage:** ⚠️ Improved support for default values on storage items ([#477](https://github.com/wxt-dev/wxt/pull/477))

### 🩹 Fixes

- **storage:** ⚠️ Only run migrations when the extension is updated ([#478](https://github.com/wxt-dev/wxt/pull/478))
- Improve dev mode for content scripts registered at runtime ([#474](https://github.com/wxt-dev/wxt/pull/474))

### 📖 Documentation

- **storage:** Update docs ([91fc41c](https://github.com/wxt-dev/wxt/commit/91fc41c))

## v0.16.11

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.10...v0.16.11)

### 🩹 Fixes

- Output main JS file for HTML entrypoints to chunks directory ([#473](https://github.com/wxt-dev/wxt/pull/473))

### 🏡 Chore

- **e2e:** Remove log ([4fda203](https://github.com/wxt-dev/wxt/commit/4fda203))

### 🤖 CI

- Fix codecov warning in release workflow ([7c6973f](https://github.com/wxt-dev/wxt/commit/7c6973f))
- Upgrade `pnpm/action-setup` to v3 ([905bfc7](https://github.com/wxt-dev/wxt/commit/905bfc7))

## v0.16.10

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.9...v0.16.10)

### 🚀 Enhancements

- Customize when content scripts are registered, in the manifest or at runtime ([#471](https://github.com/wxt-dev/wxt/pull/471))

### 🩹 Fixes

- Don't assume react when importing JSX entrypoints during build ([#470](https://github.com/wxt-dev/wxt/pull/470))
- Respect `configFile` option ([#472](https://github.com/wxt-dev/wxt/pull/472))

## v0.16.9

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.8...v0.16.9)

### 🚀 Enhancements

- Support setting side panel options in HTML file ([#468](https://github.com/wxt-dev/wxt/pull/468))

### 🩹 Fixes

- Fix order of ShadowRootUI hooks calling ([#459](https://github.com/wxt-dev/wxt/pull/459))

### 📖 Documentation

- Add wrapper div to react's `createShadowRootUi` example ([bc24ea4](https://github.com/wxt-dev/wxt/commit/bc24ea4))

### 🏡 Chore

- Simplify entrypoint types ([#464](https://github.com/wxt-dev/wxt/pull/464))

### ❤️ Contributors

- Okou ([@ookkoouu](https://github.com/ookkoouu))

## v0.16.8

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.7...v0.16.8)

### 🩹 Fixes

- Watch files outside project root during development ([#454](https://github.com/wxt-dev/wxt/pull/454))

### 📖 Documentation

- Add loading and error states for "Who's using WXT" section ([447a48f](https://github.com/wxt-dev/wxt/commit/447a48f))

## v0.16.7

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.6...v0.16.7)

### 🚀 Enhancements

- Generate ESLint globals file for auto-imports ([#450](https://github.com/wxt-dev/wxt/pull/450))

### 🔥 Performance

- Upgrade Vite to 5.1 ([#452](https://github.com/wxt-dev/wxt/pull/452))

### 📖 Documentation

- Add section about dev mode differences ([a0d1643](https://github.com/wxt-dev/wxt/commit/a0d1643))
- Remove anchor from content script ui examples ([87a62a1](https://github.com/wxt-dev/wxt/commit/87a62a1))

### 🏡 Chore

- **e2e:** Use `wxt prepare` instead of `wxt build` when possible to speed up E2E tests ([#451](https://github.com/wxt-dev/wxt/pull/451))

## v0.16.6

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.5...v0.16.6)

### 🚀 Enhancements

- Add option to customize the analysis artifacts output ([#431](https://github.com/wxt-dev/wxt/pull/431))

### 🩹 Fixes

- Use `insertBefore` on mounting content script UI ([ba85fdf](https://github.com/wxt-dev/wxt/commit/ba85fdf))

### 💅 Refactors

- Use `Element.prepend` on mounting UI ([295f860](https://github.com/wxt-dev/wxt/commit/295f860))

### 📖 Documentation

- Fix `createShadowRootUi` unmount calls ([946072f](https://github.com/wxt-dev/wxt/commit/946072f))

### 🏡 Chore

- Enable skipped test since it works now ([6b8dfdf](https://github.com/wxt-dev/wxt/commit/6b8dfdf))

### ❤️ Contributors

- Lionelhorn ([@Lionelhorn](https://github.com/Lionelhorn))
- Okou ([@ookkoouu](https://github.com/ookkoouu))

## v0.16.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.4...v0.16.5)

### 🩹 Fixes

- Support node 20 when running `wxt submit` ([e835502](https://github.com/wxt-dev/wxt/commit/e835502))

### 📖 Documentation

- Remove "coming soon" from automated publishing feature ([2b374b9](https://github.com/wxt-dev/wxt/commit/2b374b9))

## v0.16.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.3...v0.16.4)

### 🚀 Enhancements

- Automatically convert MV3 `web_accessible_resources` to MV2 ([#423](https://github.com/wxt-dev/wxt/pull/423))
- Add option to customize the analysis output filename ([#426](https://github.com/wxt-dev/wxt/pull/426))

### 🩹 Fixes

- Don't use immer for `transformManifest` ([#424](https://github.com/wxt-dev/wxt/pull/424))
- Exclude analysis files from the build summary ([#425](https://github.com/wxt-dev/wxt/pull/425))

### 🏡 Chore

- Fix fake path in test data generator ([d0f1c70](https://github.com/wxt-dev/wxt/commit/d0f1c70))

## v0.16.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.2...v0.16.3)

### 🚀 Enhancements

- Hooks ([#419](https://github.com/wxt-dev/wxt/pull/419))

### 🩹 Fixes

- **init:** Use `ungh` to prevent rate limits when loading templates ([37ad2c7](https://github.com/wxt-dev/wxt/commit/37ad2c7))

### 📖 Documentation

- Fix typo of intuitive ([#415](https://github.com/wxt-dev/wxt/pull/415))
- Fix typo of opinionated ([#416](https://github.com/wxt-dev/wxt/pull/416))

### 🏡 Chore

- Add dependabot for github actions ([#404](https://github.com/wxt-dev/wxt/pull/404))
- **deps-dev:** Bump happy-dom from 12.10.3 to 13.3.8 ([#411](https://github.com/wxt-dev/wxt/pull/411))
- **deps-dev:** Bump typescript from 5.3.2 to 5.3.3 ([#409](https://github.com/wxt-dev/wxt/pull/409))
- Register global `wxt` instance ([#418](https://github.com/wxt-dev/wxt/pull/418))

### ❤️ Contributors

- Chen Hua ([@hcljsq](https://github.com/hcljsq))
- Florian Metz ([@Timeraa](http://github.com/Timeraa))

## v0.16.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.1...v0.16.2)

### 🩹 Fixes

- Don't crash background service worker when using `import.meta.url` ([#402](https://github.com/wxt-dev/wxt/pull/402))

## v0.16.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.16.0...v0.16.1)

### 🩹 Fixes

- Don't require config to run `wxt submit init` ([9318346](https://github.com/wxt-dev/wxt/commit/9318346))

### 📖 Documentation

- Add premid extension to homepage ([#399](https://github.com/wxt-dev/wxt/pull/399))

### 🏡 Chore

- **templates:** Upgrade to wxt `^0.16.0` ([f0b2a12](https://github.com/wxt-dev/wxt/commit/f0b2a12))

### ❤️ Contributors

- Florian Metz ([@Timeraa](http://github.com/Timeraa))

## v0.16.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.15.4...v0.16.0)

### 🚀 Enhancements

- ⚠️ ESM background support ([#398](https://github.com/wxt-dev/wxt/pull/398))

### 📖 Documentation

- Document how to opt into ESM ([1e12ce2](https://github.com/wxt-dev/wxt/commit/1e12ce2))

### 🏡 Chore

- **deps-dev:** Bump lint-staged from 15.2.0 to 15.2.1 ([#395](https://github.com/wxt-dev/wxt/pull/395))
- **deps-dev:** Bump p-map from 7.0.0 to 7.0.1 ([#396](https://github.com/wxt-dev/wxt/pull/396))
- **deps-dev:** Bump @vitest/coverage-v8 from 1.0.1 to 1.2.2 ([#397](https://github.com/wxt-dev/wxt/pull/397))

## v0.15.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.15.3...v0.15.4)

### 🩹 Fixes

- **submit:** Load `.env.submit` automatically when running `wxt submit` and `wxt submit init` ([#391](https://github.com/wxt-dev/wxt/pull/391))

## v0.15.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.15.2...v0.15.3)

### 🩹 Fixes

- **dev:** Reload `<name>/index.html` entrypoints properly on save ([#390](https://github.com/wxt-dev/wxt/pull/390))

## v0.15.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.15.1...v0.15.2)

### 🚀 Enhancements

- Add `submit` command ([#370](https://github.com/wxt-dev/wxt/pull/370))

### 🩹 Fixes

- **dev:** Resolve `script` and `link` aliases ([#387](https://github.com/wxt-dev/wxt/pull/387))

### ❤️ Contributors

- Nenad Novaković ([@dvlden](https://github.com/dvlden))

## v0.15.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.15.0...v0.15.1)

### 🚀 Enhancements

- Allow passing custom preferences to chrome, enabling dev mode on `chrome://extensions` and allowing content script sourcemaps automatically ([#384](https://github.com/wxt-dev/wxt/pull/384))

### 🩹 Fixes

- **security:** Upgrade to vite@5.0.12 to resolve CVE-2024-23331 ([39b76d3](https://github.com/wxt-dev/wxt/commit/39b76d3))

### 📖 Documentation

- Fixed doc errors on the guide/extension-api page ([#383](https://github.com/wxt-dev/wxt/pull/383))

### 🏡 Chore

- Fix vite version conflicts in demo extension ([98d2792](https://github.com/wxt-dev/wxt/commit/98d2792))

### ❤️ Contributors

- 0x7a7a ([@0x7a7a](https://github.com/0x7a7a))

## v0.15.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.7...v0.15.0)

### 🚀 Enhancements

- **zip:** ⚠️ Add `includeSources` and rename `ignoredSources` to `excludeSources` ([#378](https://github.com/wxt-dev/wxt/pull/378))

### 🩹 Fixes

- Generate missing sourcemap in `wxt:unimport` plugin ([#381](https://github.com/wxt-dev/wxt/pull/381))
- ⚠️ Move browser constants to `import.meta.env` ([#380](https://github.com/wxt-dev/wxt/pull/380))
- Enable inline sourcemaps by default during development ([#382](https://github.com/wxt-dev/wxt/pull/382))

### 📖 Documentation

- Fix typo ([f9718a1](https://github.com/wxt-dev/wxt/commit/f9718a1))

### 🏡 Chore

- Update contributor docs ([eb758bd](https://github.com/wxt-dev/wxt/commit/eb758bd))

### ❤️ Contributors

- Nenad Novaković ([@dvlden](https://github.com/dvlden))

## v0.14.7

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.6...v0.14.7)

### 🩹 Fixes

- Improve error messages when importing and building entrypoints ([3b63a51](https://github.com/wxt-dev/wxt/commit/3b63a51))
- **storage:** Throw better error message when importing outside a extension environment ([35865ad](https://github.com/wxt-dev/wxt/commit/35865ad))
- Upgrade `web-ext-run` ([62ecb6f](https://github.com/wxt-dev/wxt/commit/62ecb6f))

### 📖 Documentation

- Add `matches` to content script examples ([dab8efa](https://github.com/wxt-dev/wxt/commit/dab8efa))
- Fix incorrect sample code ([#372](https://github.com/wxt-dev/wxt/pull/372))
- Document defined constants for the build target ([68874e6](https://github.com/wxt-dev/wxt/commit/68874e6))
- Add missing `await` to `createShadowRootUi` examples ([fc45c37](https://github.com/wxt-dev/wxt/commit/fc45c37))

### ❤️ Contributors

- 東奈比 ([@dongnaebi](http://github.com/dongnaebi))

## v0.14.6

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.5...v0.14.6)

### 🚀 Enhancements

- Restart dev mode when saving config ([#365](https://github.com/wxt-dev/wxt/pull/365))
- Add basic validation for entrypoint options ([#368](https://github.com/wxt-dev/wxt/pull/368))

### 🩹 Fixes

- Add subdependency bin directory so `wxt build --analyze` works with PNPM ([#363](https://github.com/wxt-dev/wxt/pull/363))
- Sort build output files naturally ([#364](https://github.com/wxt-dev/wxt/pull/364))

### 🤖 CI

- Check for type errors in demo before building ([4b005b4](https://github.com/wxt-dev/wxt/commit/4b005b4))

## v0.14.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.4...v0.14.5)

### 🚀 Enhancements

- Add `dev.reloadCommand` config ([#362](https://github.com/wxt-dev/wxt/pull/362))

### 🩹 Fixes

- Disable reload dev command when 4 commands are already registered ([#361](https://github.com/wxt-dev/wxt/pull/361))

## v0.14.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.3...v0.14.4)

### 🩹 Fixes

- Allow requiring built-in node modules from ESM CLI ([#356](https://github.com/wxt-dev/wxt/pull/356))

### 🏡 Chore

- Add unit tests for passing flags via the CLI ([#354](https://github.com/wxt-dev/wxt/pull/354))

## v0.14.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.2...v0.14.3)

### 🩹 Fixes

- Make `getArrayFromFlags` result can be undefined ([#352](https://github.com/wxt-dev/wxt/pull/352))

### ❤️ Contributors

- Yuns ([@yunsii](http://github.com/yunsii))

## v0.14.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.1...v0.14.2)

### 🚀 Enhancements

- Add `filterEntrypoints` option to speed up development ([#344](https://github.com/wxt-dev/wxt/pull/344))

### 🔥 Performance

- Only call `findEntrypoint` once per build ([#342](https://github.com/wxt-dev/wxt/pull/342))

### 🩹 Fixes

- Improve error message and document use of imported variables outside an entrypoint's `main` function ([#346](https://github.com/wxt-dev/wxt/pull/346))
- Allow `browser.runtime.getURL` to include hashes and query params for HTML paths ([#350](https://github.com/wxt-dev/wxt/pull/350))

### 📖 Documentation

- Fix typos and outdated ui function usage ([#347](https://github.com/wxt-dev/wxt/pull/347))

### 🏡 Chore

- Update templates to `^0.14.0` ([70a4961](https://github.com/wxt-dev/wxt/commit/70a4961))
- Fix typo in function name ([a329e24](https://github.com/wxt-dev/wxt/commit/a329e24))

### ❤️ Contributors

- Yuns ([@yunsii](http://github.com/yunsii))
- Armin

## v0.14.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.14.0...v0.14.1)

### 🩹 Fixes

- Use `Alt+R`/`Opt+R` to reload extension during development ([b6ab7a9](https://github.com/wxt-dev/wxt/commit/b6ab7a9))

## v0.14.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.13.5...v0.14.0)

### 🚀 Enhancements

- ⚠️ Refactor content script UI functions and add helper for "integrated" UIs ([#333](https://github.com/wxt-dev/wxt/pull/333))

## v0.13.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.13.4...v0.13.5)

### 🩹 Fixes

- Strip path from `web_accessible_resources[0].matches` ([#332](https://github.com/wxt-dev/wxt/pull/332))

### 📖 Documentation

- Add section about customizing other browser options during development ([8683bd4](https://github.com/wxt-dev/wxt/commit/8683bd4))

### 🏡 Chore

- Update bug report template ([9a2cc18](https://github.com/wxt-dev/wxt/commit/9a2cc18))

## v0.13.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.13.3...v0.13.4)

### 🩹 Fixes

- Disable minification during development ([b7cdf15](https://github.com/wxt-dev/wxt/commit/b7cdf15))

### 🏡 Chore

- Use `const` instead of `let` ([2770974](https://github.com/wxt-dev/wxt/commit/2770974))

## v0.13.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.13.2...v0.13.3)

### 🚀 Enhancements

- **DX:** Add `ctrl+E`/`cmd+E` shortcut to reload extension during development ([#322](https://github.com/wxt-dev/wxt/pull/322))

### 🏡 Chore

- **deps-dev:** Bump tsx from 4.6.2 to 4.7.0 ([#320](https://github.com/wxt-dev/wxt/pull/320))
- **deps-dev:** Bump prettier from 3.1.0 to 3.1.1 ([#318](https://github.com/wxt-dev/wxt/pull/318))
- **deps-dev:** Bump vitepress from 1.0.0-rc.31 to 1.0.0-rc.34 ([#316](https://github.com/wxt-dev/wxt/pull/316))
- Refactor manifest generation E2E tests to unit tests ([#323](https://github.com/wxt-dev/wxt/pull/323))

## v0.13.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.13.1...v0.13.2)

### 🚀 Enhancements

- Add `isolateEvents` option to `createContentScripUi` ([#313](https://github.com/wxt-dev/wxt/pull/313))

### 📖 Documentation

- Remove duplicate `entrypoints/` path ([76e63e2](https://github.com/wxt-dev/wxt/commit/76e63e2))
- Update unlisted pages/scripts description ([c99a281](https://github.com/wxt-dev/wxt/commit/c99a281))
- Update content script entrypoint docs ([1360eb7](https://github.com/wxt-dev/wxt/commit/1360eb7))
- Add example for setting up custom panels/panes in devtools ([#308](https://github.com/wxt-dev/wxt/pull/308))
- Use example tags to automate relevant example lists ([#311](https://github.com/wxt-dev/wxt/pull/311))

### 🏡 Chore

- Update templates to `^0.13.0` ([#309](https://github.com/wxt-dev/wxt/pull/309))
- Upgrade template dependencies ([#310](https://github.com/wxt-dev/wxt/pull/310))
- Re-enable coverage ([#312](https://github.com/wxt-dev/wxt/pull/312))

### ❤️ Contributors

- 冯不游

## v0.13.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.13.0...v0.13.1)

### 🩹 Fixes

- **storage:** Support multiple `:` characters in storage keys ([#303](https://github.com/wxt-dev/wxt/pull/303))
- Ship `vite/client` types internally for proper resolution using PNPM ([#304](https://github.com/wxt-dev/wxt/pull/304))

### 📖 Documentation

- Reorder guide ([6421ab3](https://github.com/wxt-dev/wxt/commit/6421ab3))
- General fixes and improvements ([2ad099b](https://github.com/wxt-dev/wxt/commit/2ad099b))

### 🏡 Chore

- Update `scripts/build.ts` show current build step in progress, not completed count ([#306](https://github.com/wxt-dev/wxt/pull/306))

## v0.13.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.12.5...v0.13.0)

### 🚀 Enhancements

- ⚠️ New `wxt/storage` APIs ([#300](https://github.com/wxt-dev/wxt/pull/300))

## v0.12.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.12.4...v0.12.5)

### 🩹 Fixes

- Correct import in dev-only, noop background ([#298](https://github.com/wxt-dev/wxt/pull/298))

## v0.12.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.12.3...v0.12.4)

### 🩹 Fixes

- Disable Vite CJS warnings ([#296](https://github.com/wxt-dev/wxt/pull/296))

## v0.12.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.12.2...v0.12.3)

### 🩹 Fixes

- Correctly mock `webextension-polyfill` for Vitest ([#294](https://github.com/wxt-dev/wxt/pull/294))

## v0.12.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.12.1...v0.12.2)

### 🚀 Enhancements

- Support PNPM without hoisting dependencies ([#291](https://github.com/wxt-dev/wxt/pull/291))

## v0.12.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.12.0...v0.12.1)

### 🩹 Fixes

- Upgrade `@webext-core/match-patterns` to `1.0.3` ([#289](https://github.com/wxt-dev/wxt/pull/289))
- Fix `package.json` lint errors ([#290](https://github.com/wxt-dev/wxt/pull/290))

### 🏡 Chore

- Upgrade templates to `wxt@^0.12.0` ([#285](https://github.com/wxt-dev/wxt/pull/285))

## v0.12.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.11.2...v0.12.0)

### 🚀 Enhancements

- ⚠️ Add support for "main world" content scripts ([#284](https://github.com/wxt-dev/wxt/pull/284))

### 🩹 Fixes

- Only use type imports for Vite ([#278](https://github.com/wxt-dev/wxt/pull/278))
- Throw error when no entrypoints are found ([#283](https://github.com/wxt-dev/wxt/pull/283))

### 📖 Documentation

- Improve content script UI guide ([#272](https://github.com/wxt-dev/wxt/pull/272))
- Fix dead links ([291d25b](https://github.com/wxt-dev/wxt/commit/291d25b))

### 🏡 Chore

- Convert WXT CLI to an ESM binary ([#279](https://github.com/wxt-dev/wxt/pull/279))

## v0.11.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.11.1...v0.11.2)

### 🩹 Fixes

- Discover `.js`, `.jsx`, and `.tsx` unlisted scripts correctly ([#274](https://github.com/wxt-dev/wxt/pull/274))
- Improve duplicate entrypoint name detection and catch the error before loading their config ([#276](https://github.com/wxt-dev/wxt/pull/276))

### 📖 Documentation

- Improve content script UI docs ([#268](https://github.com/wxt-dev/wxt/pull/268))

### 🏡 Chore

- Update sSolid template to vite 5 ([#265](https://github.com/wxt-dev/wxt/pull/265))
- Add missing navigation item ([bcb93af](https://github.com/wxt-dev/wxt/commit/bcb93af))

## v0.11.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.11.0...v0.11.1)

### 🚀 Enhancements

- Add util for detecting URL changes in content scripts ([#264](https://github.com/wxt-dev/wxt/pull/264))

### 🏡 Chore

- Upgrade templates to `wxt@^0.11.0` ([#263](https://github.com/wxt-dev/wxt/pull/263))

## v0.11.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.10.4...v0.11.0)

### 🚀 Enhancements

- ⚠️ Vite 5 support ([#261](https://github.com/wxt-dev/wxt/pull/261))

### 📖 Documentation

- Adds tl;dv to homepage ([#260](https://github.com/wxt-dev/wxt/pull/260))

### 🏡 Chore

- Speed up CI using `pnpm` instead of `npm` ([#259](https://github.com/wxt-dev/wxt/pull/259))
- Abstract vite from WXT's core logic ([#242](https://github.com/wxt-dev/wxt/pull/242))

### ❤️ Contributors

- Ítalo Brasil ([@italodeverdade](http://github.com/italodeverdade))

## v0.10.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.10.3...v0.10.4)

### 🚀 Enhancements

- Add config to customize `outDir` ([#258](https://github.com/wxt-dev/wxt/pull/258))

### 📖 Documentation

- Add Doozy to homepage ([#249](https://github.com/wxt-dev/wxt/pull/249))
- Update sidepanel availability ([#250](https://github.com/wxt-dev/wxt/pull/250))

### 🏡 Chore

- **deps-dev:** Bump prettier from 3.0.3 to 3.1.0 ([#254](https://github.com/wxt-dev/wxt/pull/254))
- **deps-dev:** Bump @types/lodash.merge from 4.6.8 to 4.6.9 ([#255](https://github.com/wxt-dev/wxt/pull/255))
- **deps-dev:** Bump tsx from 3.14.0 to 4.6.1 ([#252](https://github.com/wxt-dev/wxt/pull/252))

### ❤️ Contributors

- 冯不游

## v0.10.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.10.2...v0.10.3)

### 🩹 Fixes

- **auto-imports:** Don't add imports to `node_module` dependencies ([#247](https://github.com/wxt-dev/wxt/pull/247))

### 📖 Documentation

- Fix typo ([317b1b6](https://github.com/wxt-dev/wxt/commit/317b1b6))

### 🏡 Chore

- Trigger docs upgrade via webhook ([742b996](https://github.com/wxt-dev/wxt/commit/742b996))
- Use `normalize-path` instead of `vite.normalizePath` ([#244](https://github.com/wxt-dev/wxt/pull/244))
- Use `defu` for merging some config objects ([#243](https://github.com/wxt-dev/wxt/pull/243))

### 🤖 CI

- Publish docs on push to main ([1611c1d](https://github.com/wxt-dev/wxt/commit/1611c1d))
- Only print response headers from docs webhook ([97cbda3](https://github.com/wxt-dev/wxt/commit/97cbda3))

## v0.10.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.10.1...v0.10.2)

### 🩹 Fixes

- Apply `mode` option to build steps correctly ([82ed821](https://github.com/wxt-dev/wxt/commit/82ed821))

### 🏡 Chore

- Upgrade templates to v0.10 ([#239](https://github.com/wxt-dev/wxt/pull/239))

## v0.10.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.10.0...v0.10.1)

### 🩹 Fixes

- Remove WXT global to remove unused modules from production builds ([3da3e07](https://github.com/wxt-dev/wxt/commit/3da3e07))

## v0.10.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.9.2...v0.10.0)

### 🚀 Enhancements

- List `bun` as an experimental option in `wxt init` ([#233](https://github.com/wxt-dev/wxt/pull/233))
- ⚠️ Allow plural directory and only png's for manifest icons ([#237](https://github.com/wxt-dev/wxt/pull/237))
- Add `wxt/storage` API ([#234](https://github.com/wxt-dev/wxt/pull/234))

### 🩹 Fixes

- Don't use `bun` to load entrypoint config ([#232](https://github.com/wxt-dev/wxt/pull/232))

### 📖 Documentation

- Update main README links ([207b750](https://github.com/wxt-dev/wxt/commit/207b750))

#### ⚠️ Breaking Changes

- ⚠️ No longer discover icons with extensions other than `.png`. If you previously used `.jpg`, `.jpeg`, `.bmp`, or `.svg`, you'll need to convert your icons to `.png` files or manually add them to the manifest inside your `wxt.config.ts` file ([#237](https://github.com/wxt-dev/wxt/pull/237))

### ❤️ Contributors

- Nenad Novaković ([@dvlden](https://github.com/dvlden))

## v0.9.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.9.1...v0.9.2)

### 🚀 Enhancements

- Experimental option to exclude `webextension-polyfill` ([#231](https://github.com/wxt-dev/wxt/pull/231))

### 🤖 CI

- Fix sync-release workflow ([d1b5230](https://github.com/wxt-dev/wxt/commit/d1b5230))

## v0.9.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.9.0...v0.9.1)

### 🚀 Enhancements

- Add `alias` config for customizing path aliases ([#216](https://github.com/wxt-dev/wxt/pull/216))

### 🩹 Fixes

- Move `webextension-polyfill` from peer to regular dependencies ([609ae2a](https://github.com/wxt-dev/wxt/commit/609ae2a))
- Generate valid manifest for Firefox MV3 ([#229](https://github.com/wxt-dev/wxt/pull/229))

### 📖 Documentation

- Add examples ([c81dfff](https://github.com/wxt-dev/wxt/commit/c81dfff))
- Improve the "Used By" section on homepage ([#220](https://github.com/wxt-dev/wxt/pull/220))
- Add UltraWideo to homepage ([#193](https://github.com/wxt-dev/wxt/pull/193))
- Add StayFree to homepage ([#221](https://github.com/wxt-dev/wxt/pull/221))
- Update feature comparison ([67ffa44](https://github.com/wxt-dev/wxt/commit/67ffa44))

### 🏡 Chore

- Remove whitespace from generated `.wxt` files ([#211](https://github.com/wxt-dev/wxt/pull/211))
- Upgrade templates to `wxt@^0.9.0` ([#214](https://github.com/wxt-dev/wxt/pull/214))
- Update Vite dependency range to `^4.0.0 || ^5.0.0-0` ([f1e8084](https://github.com/wxt-dev/wxt/commit/f1e8084be89e512dde441b9197a99183c497f67d))

### 🤖 CI

- Automatically sync GitHub releases with `CHANGELOG.md` on push ([#218](https://github.com/wxt-dev/wxt/pull/218))

### ❤️ Contributors

- Aaron Klinker ([@aaronklinker-st](http://github.com/aaronklinker-st))

## v0.9.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.7...v0.9.0)

### 🩹 Fixes

- ⚠️ Remove `lib` from `.wxt/tsconfig.json` ([#209](https://github.com/wxt-dev/wxt/pull/209))

### 📖 Documentation

- Fix heading ([345406f](https://github.com/wxt-dev/wxt/commit/345406f))
- Add demo video ([#208](https://github.com/wxt-dev/wxt/pull/208))

### 🏡 Chore

- Fix Svelte and React template READMEs ([#207](https://github.com/wxt-dev/wxt/pull/207))

### ❤️ Contributors

- yyyanghj ([@yyyanghj](https://github.com/yyyanghj))

## v0.8.7

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.6...v0.8.7)

### 🚀 Enhancements

- `createContentScriptIframe` utility ([#206](https://github.com/wxt-dev/wxt/pull/206))

### 🏡 Chore

- **deps-dev:** Bump happy-dom from 12.4.0 to 12.10.3 ([#194](https://github.com/wxt-dev/wxt/pull/194))
- **deps-dev:** Bump tsx from 3.12.8 to 3.14.0 ([#198](https://github.com/wxt-dev/wxt/pull/198))
- Upgrade types ([f3874da](https://github.com/wxt-dev/wxt/commit/f3874da))
- **deps-dev:** Upgrade `lint-staged` to `^15.0.2` ([5f74a54](https://github.com/wxt-dev/wxt/commit/5f74a54))
- **deps-dev:** Upgrade `execa` to `^8.0.1` ([#200](https://github.com/wxt-dev/wxt/pull/200))
- **deps-dev:** Upgrade `typedoc` to `^0.25.3` ([#201](https://github.com/wxt-dev/wxt/pull/201))
- **deps-dev:** Upgrade `vue` to `3.3.7` ([0b8d101](https://github.com/wxt-dev/wxt/commit/0b8d101))
- **deps-dev:** Upgrade `vitepress` to `1.0.0-rc.24` ([5de18e5](https://github.com/wxt-dev/wxt/commit/5de18e5))
- **deps-dev:** Update `@type/*` packages for demo ([cd4d00e](https://github.com/wxt-dev/wxt/commit/cd4d00e))
- **deps-dev:** Update `sass` to `1.69.5` ([183bb02](https://github.com/wxt-dev/wxt/commit/183bb02))
- Improve prettier git hook ([0f09cbe](https://github.com/wxt-dev/wxt/commit/0f09cbe))
- Run E2E tests in parallel ([#204](https://github.com/wxt-dev/wxt/pull/204))

### 🤖 CI

- Separate validation into multiple jobs ([#203](https://github.com/wxt-dev/wxt/pull/203))

## v0.8.6

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.5...v0.8.6)

### 🩹 Fixes

- Inline WXT modules inside `WxtVitest` plugin ([b75c553](https://github.com/wxt-dev/wxt/commit/b75c553))

## v0.8.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.4...v0.8.5)

### 🚀 Enhancements

- Refactor project structure to export `initialize`, `prepare`, and `zip` functions ([#182](https://github.com/wxt-dev/wxt/pull/182))

### 🩹 Fixes

- Enable Vue SFC auto-imports in `vue` template ([f8a0fb3](https://github.com/wxt-dev/wxt/commit/f8a0fb3))

### 📖 Documentation

- Improve `runner.binaries` documentation ([d9e9b43](https://github.com/wxt-dev/wxt/commit/d9e9b43))
- Update auto-imports.md ([#186](https://github.com/wxt-dev/wxt/pull/186))
- Add `test.server.deps.inline` to Vitest guide ([19756c6](https://github.com/wxt-dev/wxt/commit/19756c6))

### 🏡 Chore

- Update template docs ([2e24b9e](https://github.com/wxt-dev/wxt/commit/2e24b9e))
- Reduce package size by 70%, 1.92 MB to 590 kB ([#190](https://github.com/wxt-dev/wxt/pull/190))

### ❤️ Contributors

- Nenad Novaković ([@dvlden](https://github.com/dvlden))

## v0.8.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.3...v0.8.4)

### 🩹 Fixes

- Allow actions without a popup ([#181](https://github.com/wxt-dev/wxt/pull/181))

## v0.8.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.2...v0.8.3)

### 🚀 Enhancements

- Add testing utils under `wxt/testing` ([#178](https://github.com/wxt-dev/wxt/pull/178))

## v0.8.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.1...v0.8.2)

### 🩹 Fixes

- **firefox:** Stop extending `AbortController` to fix crash in content scripts ([#176](https://github.com/wxt-dev/wxt/pull/176))

### 🏡 Chore

- Improve output consistency ([#175](https://github.com/wxt-dev/wxt/pull/175))

## v0.8.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.8.0...v0.8.1)

### 🩹 Fixes

- Output `action.browser_style` correctly ([6a93f20](https://github.com/wxt-dev/wxt/commit/6a93f20))

### 📖 Documentation

- Generate full API docs with typedoc ([#174](https://github.com/wxt-dev/wxt/pull/174))

## v0.8.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.7.5...v0.8.0)

### 🚀 Enhancements

- ⚠️ Use `defineUnlistedScript` to define unlisted scripts ([#167](https://github.com/wxt-dev/wxt/pull/167))

### 📖 Documentation

- Fix wrong links ([#166](https://github.com/wxt-dev/wxt/pull/166))

### 🌊 Types

- ⚠️ Rename `BackgroundScriptDefintition` to `BackgroundDefinition` ([446f265](https://github.com/wxt-dev/wxt/commit/446f265))

### ❤️ Contributors

- 渣渣120 [@WOSHIZHAZHA120](https://github.com/WOSHIZHAZHA120)

## v0.7.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.7.4...v0.7.5)

### 🩹 Fixes

- More consistent `version_name` generation between browsers ([#163](https://github.com/wxt-dev/wxt/pull/163))
- Ignore non-manifest fields when merging content script entries ([#164](https://github.com/wxt-dev/wxt/pull/164))
- Add `browser_style` to popup options ([#165](https://github.com/wxt-dev/wxt/pull/165))

## v0.7.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.7.3...v0.7.4)

### 🩹 Fixes

- Support `react-refresh` when pre-rendering HTML pages in dev mode ([#158](https://github.com/wxt-dev/wxt/pull/158))

### 📖 Documentation

- Add migration guides ([b58fb02](https://github.com/wxt-dev/wxt/commit/b58fb02))

### 🏡 Chore

- Upgrade templates to v0.7 ([#156](https://github.com/wxt-dev/wxt/pull/156))

## v0.7.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.7.2...v0.7.3)

### 🚀 Enhancements

- Support JS entrypoints ([#155](https://github.com/wxt-dev/wxt/pull/155))

## v0.7.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.7.1...v0.7.2)

### 🚀 Enhancements

- Allow customizing entrypoint options per browser ([#154](https://github.com/wxt-dev/wxt/pull/154))

### 🩹 Fixes

- Default safari to MV2 ([5807931](https://github.com/wxt-dev/wxt/commit/5807931))
- Add missing `persistent` type to `defineBackgroundScript` ([d9fdcb5](https://github.com/wxt-dev/wxt/commit/d9fdcb5))

### 📖 Documentation

- Restructure website to improve UX ([#149](https://github.com/wxt-dev/wxt/pull/149))
- Add docs for development and testing ([f58d69d](https://github.com/wxt-dev/wxt/commit/f58d69d))

### 🏡 Chore

- **deps-dev:** Bump @types/fs-extra from 11.0.1 to 11.0.2 ([#144](https://github.com/wxt-dev/wxt/pull/144))
- **deps-dev:** Bump @faker-js/faker from 8.0.2 to 8.1.0 ([#146](https://github.com/wxt-dev/wxt/pull/146))
- **deps-dev:** Bump vitest-mock-extended from 1.2.1 to 1.3.0 ([#147](https://github.com/wxt-dev/wxt/pull/147))
- **deps-dev:** Bump vitest from 0.34.3 to 0.34.6 ([#145](https://github.com/wxt-dev/wxt/pull/145))
- **deps-dev:** Bump typescript from 5.1 to 5.2 ([#148](https://github.com/wxt-dev/wxt/pull/148))

## v0.7.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.7.0...v0.7.1)

### 🚀 Enhancements

- `createContentScriptUi` helper ([#143](https://github.com/wxt-dev/wxt/pull/143))

### 📖 Documentation

- Add docs for `createContentScriptUi` ([65fcfc0](https://github.com/wxt-dev/wxt/commit/65fcfc0))

### 🏡 Chore

- **release:** V0.7.1-alpha1 ([2d4983e](https://github.com/wxt-dev/wxt/commit/2d4983e))

## v0.7.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.6.6...v0.7.0)

### 🚀 Enhancements

- Content script `cssInjectionMode` ([#141](https://github.com/wxt-dev/wxt/pull/141))

### 🩹 Fixes

- Validate transformed manifest correctly ([4b2012c](https://github.com/wxt-dev/wxt/commit/4b2012c))
- ⚠️ Output content script CSS to `content-scripts/<name>.css` ([#140](https://github.com/wxt-dev/wxt/pull/140))
- Reorder typescript paths to give priority to `@` and `~` over `@@` and `~~` ([#142](https://github.com/wxt-dev/wxt/pull/142))

### 🏡 Chore

- Store user config metadata in memory ([0591050](https://github.com/wxt-dev/wxt/commit/0591050))

## v0.6.6

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.6.5...v0.6.6)

### 🚀 Enhancements

- Disable opening browser automatically during dev mode ([#136](https://github.com/wxt-dev/wxt/pull/136))

## v0.6.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.6.4...v0.6.5)

### 🩹 Fixes

- Don't crash when `<all_urls>` matches is used in dev mode ([b48cee9](https://github.com/wxt-dev/wxt/commit/b48cee9))
- Support loading `tsx` entrypoints ([#134](https://github.com/wxt-dev/wxt/pull/134))

### 📖 Documentation

- Add tags for SEO and socials ([96be879](https://github.com/wxt-dev/wxt/commit/96be879))
- Add more content to the homepage ([5570793](https://github.com/wxt-dev/wxt/commit/5570793))
- Fix DX section sizing ([41e1549](https://github.com/wxt-dev/wxt/commit/41e1549))
- Add link to update extensions using WXT ([24e69fe](https://github.com/wxt-dev/wxt/commit/24e69fe))

### 🏡 Chore

- Code coverage improvements ([#131](https://github.com/wxt-dev/wxt/pull/131))

## v0.6.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.6.3...v0.6.4)

### 🩹 Fixes

- **content-scripts:** Don't throw an error when including `include` or `exclude` options on a content script ([455e7f3](https://github.com/wxt-dev/wxt/commit/455e7f3))
- Use `execaCommand` instead of `node:child_process` ([#130](https://github.com/wxt-dev/wxt/pull/130))

### 🏡 Chore

- **templates:** Add `.wxt` directory to gitignore ([#129](https://github.com/wxt-dev/wxt/pull/129))
- Increase E2E test timeout ([5482b2f](https://github.com/wxt-dev/wxt/commit/5482b2f))

## v0.6.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.6.2...v0.6.3)

### 🚀 Enhancements

- **client:** Add `block` and `addEventListener` utils to `ContentScriptContext` ([#128](https://github.com/wxt-dev/wxt/pull/128))

## v0.6.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.6.1...v0.6.2)

### 🚀 Enhancements

- `--analyze` build flag ([#125](https://github.com/wxt-dev/wxt/pull/125))
- Show spinner when building entrypoints ([#126](https://github.com/wxt-dev/wxt/pull/126))

### 📖 Documentation

- Fix import typo ([4c43072](https://github.com/wxt-dev/wxt/commit/4c43072))
- Update vite docs to use function ([e0929a6](https://github.com/wxt-dev/wxt/commit/e0929a6))

## v0.6.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.6.0...v0.6.1)

### 🚀 Enhancements

- Add `transformManifest` option ([#124](https://github.com/wxt-dev/wxt/pull/124))

### 🩹 Fixes

- Don't open browser during development when using WSL ([#123](https://github.com/wxt-dev/wxt/pull/123))

### 📖 Documentation

- Load extension details from CWS ([8e0a189](https://github.com/wxt-dev/wxt/commit/8e0a189))

## v0.6.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.5.6...v0.6.0)

### 🚀 Enhancements

- Export `ContentScriptContext` from `wxt/client` ([1f448d1](https://github.com/wxt-dev/wxt/commit/1f448d1))
- ⚠️ Require a function for `vite` configuration ([#121](https://github.com/wxt-dev/wxt/pull/121))

### 🩹 Fixes

- Use the same mode for each build step ([1f6a931](https://github.com/wxt-dev/wxt/commit/1f6a931))
- Disable dev logs in production ([3f260ee](https://github.com/wxt-dev/wxt/commit/3f260ee))

## v0.5.6

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.5.5...v0.5.6)

### 🚀 Enhancements

- Add `ContentScriptContext` util for stopping invalidated content scripts ([#120](https://github.com/wxt-dev/wxt/pull/120))

## v0.5.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.5.4...v0.5.5)

### 🩹 Fixes

- Automatically replace vite's `process.env.NODE_ENV` output in lib mode with the mode ([92039b8](https://github.com/wxt-dev/wxt/commit/92039b8))

## v0.5.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.5.3...v0.5.4)

### 🩹 Fixes

- Recognize `background/index.ts` as an entrypoint ([419fab8](https://github.com/wxt-dev/wxt/commit/419fab8))
- Don't warn about deep entrypoint subdirectories not being recognized ([87e8df9](https://github.com/wxt-dev/wxt/commit/87e8df9))

## v0.5.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.5.2...v0.5.3)

### 🩹 Fixes

- Allow function for vite config ([4ec904e](https://github.com/wxt-dev/wxt/commit/4ec904e))

### 🏡 Chore

- Refactor how config is resolved ([#118](https://github.com/wxt-dev/wxt/pull/118))

## v0.5.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.5.1...v0.5.2)

### 🩹 Fixes

- Import client utils when getting entrypoint config ([#117](https://github.com/wxt-dev/wxt/pull/117))

## v0.5.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.5.0...v0.5.1)

### 🚀 Enhancements

- Allow disabling auto-imports ([#114](https://github.com/wxt-dev/wxt/pull/114))
- Include/exclude entrypoints based on target browser ([#115](https://github.com/wxt-dev/wxt/pull/115))

### 🩹 Fixes

- Allow any string for target browser ([b4de93d](https://github.com/wxt-dev/wxt/commit/b4de93d))

## v0.5.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.4.1...v0.5.0)

### 🩹 Fixes

- **types:** Don't write to files if nothing changes ([#107](https://github.com/wxt-dev/wxt/pull/107))
- ⚠️ Change default `publicDir` to `<srcDir>/public` ([5f15f9c](https://github.com/wxt-dev/wxt/commit/5f15f9c))

### 📖 Documentation

- Add link to examples repo ([46a5036](https://github.com/wxt-dev/wxt/commit/46a5036))
- Fix typos ([beafa6a](https://github.com/wxt-dev/wxt/commit/beafa6a))
- Make README pretty ([b33b663](https://github.com/wxt-dev/wxt/commit/b33b663))
- Add migration docs ([e2350fe](https://github.com/wxt-dev/wxt/commit/e2350fe))
- Add vite customization docs ([fe966b6](https://github.com/wxt-dev/wxt/commit/fe966b6))

### 🏡 Chore

- Move repo to wxt-dev org ([ac7cbfc](https://github.com/wxt-dev/wxt/commit/ac7cbfc))
- **deps-dev:** Bump prettier from 3.0.1 to 3.0.3 ([#111](https://github.com/wxt-dev/wxt/pull/111))
- **deps-dev:** Bump tsx from 3.12.7 to 3.12.8 ([#109](https://github.com/wxt-dev/wxt/pull/109))
- **deps-dev:** Bump @types/node from 20.5.0 to 20.5.9 ([#110](https://github.com/wxt-dev/wxt/pull/110))
- Add entrypoints debug log ([dbd84c8](https://github.com/wxt-dev/wxt/commit/dbd84c8))

## v0.4.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.4.0...v0.4.1)

### 🚀 Enhancements

- **cli:** Add `wxt clean` command to delete generated files ([#106](https://github.com/wxt-dev/wxt/pull/106))

### 🩹 Fixes

- **init:** Don't show `cd .` when initializing the current directory ([e086374](https://github.com/wxt-dev/wxt/commit/e086374))

## v0.4.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.3.2...v0.4.0)

### 🚀 Enhancements

- Add `--debug` flag for printing debug logs for all CLI commands ([#75](https://github.com/wxt-dev/wxt/pull/75))
- Replace `web-ext` with `web-ext-run` ([#101](https://github.com/wxt-dev/wxt/pull/101))
- Generate types for `browser.i18n.getMessage` ([#103](https://github.com/wxt-dev/wxt/pull/103))

### 🩹 Fixes

- Allow adding custom content scripts ([b428a62](https://github.com/wxt-dev/wxt/commit/b428a62))
- Don't overwrite `wxt.config.ts` content scripts, append entrypoints to it ([5f5f1d9](https://github.com/wxt-dev/wxt/commit/5f5f1d9))
- ⚠️ Use relative path aliases inside `.wxt/tsconfig.json` ([#102](https://github.com/wxt-dev/wxt/pull/102))

### 📖 Documentation

- Add contribution guide ([#76](https://github.com/wxt-dev/wxt/pull/76))

### 🏡 Chore

- Setup dependabot for upgrading dependencies ([d66293c](https://github.com/wxt-dev/wxt/commit/d66293c))
- Update social preview ([e164bd5](https://github.com/wxt-dev/wxt/commit/e164bd5))
- Setup bug and feature issue templates ([2bde917](https://github.com/wxt-dev/wxt/commit/2bde917))
- Upgrade to prettier 3 ([#77](https://github.com/wxt-dev/wxt/pull/77))
- **deps-dev:** Bump vitest from 0.32.4 to 0.34.1 ([#81](https://github.com/wxt-dev/wxt/pull/81))
- **deps-dev:** Bump ora from 6.3.1 to 7.0.1 ([#79](https://github.com/wxt-dev/wxt/pull/79))
- **deps-dev:** Bump @types/node from 20.4.5 to 20.5.0 ([#78](https://github.com/wxt-dev/wxt/pull/78))
- **deps-dev:** Bump tsup from 7.1.0 to 7.2.0 ([#80](https://github.com/wxt-dev/wxt/pull/80))
- **deps-dev:** Bump @vitest/coverage-v8 from 0.32.4 to 0.34.1 ([#84](https://github.com/wxt-dev/wxt/pull/84))
- **deps-dev:** Bump vitepress from 1.0.0-beta.5 to 1.0.0-rc.4 ([#85](https://github.com/wxt-dev/wxt/pull/85))
- **deps-dev:** Bump vitest-mock-extended from 1.1.4 to 1.2.0 ([#87](https://github.com/wxt-dev/wxt/pull/87))
- **deps-dev:** Bump lint-staged from 13.3.0 to 14.0.0 ([#89](https://github.com/wxt-dev/wxt/pull/89))
- Fix remote code E2E test ([83e62a1](https://github.com/wxt-dev/wxt/commit/83e62a1))
- Fix failing demo build ([b58a15e](https://github.com/wxt-dev/wxt/commit/b58a15e))
- **deps-dev:** Bump vitest-mock-extended from 1.2.0 to 1.2.1 ([#97](https://github.com/wxt-dev/wxt/pull/97))
- **deps-dev:** Bump lint-staged from 14.0.0 to 14.0.1 ([#100](https://github.com/wxt-dev/wxt/pull/100))
- **deps-dev:** Bump vitest from 0.34.1 to 0.34.3 ([#99](https://github.com/wxt-dev/wxt/pull/99))
- Increase E2E test timeout because GitHub Actions Window runner is slow ([2a0842b](https://github.com/wxt-dev/wxt/commit/2a0842b))
- **deps-dev:** Bump vitepress from 1.0.0-rc.4 to 1.0.0-rc.10 ([#96](https://github.com/wxt-dev/wxt/pull/96))
- Fix test watcher restarting indefinitely ([2c7922c](https://github.com/wxt-dev/wxt/commit/2c7922c))
- Remove explicit icon config from templates ([93bfee0](https://github.com/wxt-dev/wxt/commit/93bfee0))
- Use import aliases in Vue template ([#104](https://github.com/wxt-dev/wxt/pull/104))

## v0.3.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.3.1...v0.3.2)

### 🚀 Enhancements

- Discover icons from the public directory ([#72](https://github.com/wxt-dev/wxt/pull/72))
- Don't allow auto-importing from subdirectories ([d54d611](https://github.com/wxt-dev/wxt/commit/d54d611))

### 📖 Documentation

- Document the `url:` import prefix for remote code ([323045a](https://github.com/wxt-dev/wxt/commit/323045a))
- Fix typos ([97f0938](https://github.com/wxt-dev/wxt/commit/97f0938))
- Fix capitalization ([39467d1](https://github.com/wxt-dev/wxt/commit/39467d1))
- Generate markdown for config reference ([#74](https://github.com/wxt-dev/wxt/pull/74))

### 🏡 Chore

- Upgrade dependencies ([798f02f](https://github.com/wxt-dev/wxt/commit/798f02f))
- Upgrade vite (`v4.3` &rarr; `v4.4`) ([547c185](https://github.com/wxt-dev/wxt/commit/547c185))
- Update templates to work with CSS entrypoints ([7f15305](https://github.com/wxt-dev/wxt/commit/7f15305))
- Improve file list output in CI ([#73](https://github.com/wxt-dev/wxt/pull/73))

### 🤖 CI

- Validate templates against `main` ([#66](https://github.com/wxt-dev/wxt/pull/66))
- List vite version when validating project templates ([ef140dc](https://github.com/wxt-dev/wxt/commit/ef140dc))
- Validate templates using tarball to avoid version conflicts within the `wxt/node_modules` directory ([edfa075](https://github.com/wxt-dev/wxt/commit/edfa075))

## v0.3.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.3.0...v0.3.1)

### 🚀 Enhancements

- CSS entrypoints ([#61](https://github.com/wxt-dev/wxt/pull/61))
- `init` command for bootstrapping new projects ([#65](https://github.com/wxt-dev/wxt/pull/65))

### 📖 Documentation

- Add zip command to installation scripts ([94a1097](https://github.com/wxt-dev/wxt/commit/94a1097))
- Add output paths to entrypoint docs ([3a336eb](https://github.com/wxt-dev/wxt/commit/3a336eb))
- Update installation docs ([aea866c](https://github.com/wxt-dev/wxt/commit/aea866c))
- Add publishing docs ([4184b05](https://github.com/wxt-dev/wxt/commit/4184b05))
- Add a section for extensions using WXT ([709b61a](https://github.com/wxt-dev/wxt/commit/709b61a))
- Add a comparison page to compare and contrast against Plasmo ([38d4f9c](https://github.com/wxt-dev/wxt/commit/38d4f9c))

### 🏡 Chore

- Update template projects to v0.3 ([#56](https://github.com/wxt-dev/wxt/pull/56))
- Branding and logo ([#60](https://github.com/wxt-dev/wxt/pull/60))
- Simplify binary setup ([#62](https://github.com/wxt-dev/wxt/pull/62))
- Add Solid template ([#63](https://github.com/wxt-dev/wxt/pull/63))
- Increase E2E test timeout to fix flakey test ([dfe424f](https://github.com/wxt-dev/wxt/commit/dfe424f))

### 🤖 CI

- Speed up demo validation ([3a9fd39](https://github.com/wxt-dev/wxt/commit/3a9fd39))
- Fix flakey failure when validating templates ([25677ba](https://github.com/wxt-dev/wxt/commit/25677ba))

### ❤️ Contributors

- BeanWei ([@BeanWei](https://github.com/BeanWei))

## v0.3.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.2.5...v0.3.0)

### 🚀 Enhancements

- ⚠️ Add type safety to `browser.runtime.getURL` ([58a84ec](https://github.com/wxt-dev/wxt/commit/58a84ec))
- ⚠️ Change default `publicDir` to `<rootDir>/public` ([19c0948](https://github.com/wxt-dev/wxt/commit/19c0948))
- Windows support ([#50](https://github.com/wxt-dev/wxt/pull/50))

### 🩹 Fixes

- Add `WebWorker` lib to generated tsconfig ([2c70246](https://github.com/wxt-dev/wxt/commit/2c70246))

### 📖 Documentation

- Update entrypoint directory links ([0aebb67](https://github.com/wxt-dev/wxt/commit/0aebb67))

### 🌊 Types

- Allow any string for the `__BROWSER__` global ([6092235](https://github.com/wxt-dev/wxt/commit/6092235))

### 🤖 CI

- Improve checks against `demo/` extension ([9cc464f](https://github.com/wxt-dev/wxt/commit/9cc464f))

## v0.2.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.2.4...v0.2.5)

### 🚀 Enhancements

- Auto-import from subdirectories ([547fee0](https://github.com/wxt-dev/wxt/commit/547fee0))
- Include background script in dev mode if user doesn't define one ([ca20a21](https://github.com/wxt-dev/wxt/commit/ca20a21))

### 🩹 Fixes

- Don't crash when generating types in dev mode ([d8c1903](https://github.com/wxt-dev/wxt/commit/d8c1903))
- Properly load entrypoints that reference `import.meta` ([54b18cc](https://github.com/wxt-dev/wxt/commit/54b18cc))

### 🏡 Chore

- Update templates to wxt@0.2 ([9d00eb2](https://github.com/wxt-dev/wxt/commit/9d00eb2))

### 🤖 CI

- Validate project templates ([9ac756f](https://github.com/wxt-dev/wxt/commit/9ac756f))

## v0.2.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.2.3...v0.2.4)

### 🚀 Enhancements

- Add `wxt zip` command ([#47](https://github.com/wxt-dev/wxt/pull/47))

## v0.2.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.2.2...v0.2.3)

### 🩹 Fixes

- Correctly lookup open port ([#45](https://github.com/wxt-dev/wxt/pull/45))
- Read boolean maniest options from meta tags correctly ([495c5c8](https://github.com/wxt-dev/wxt/commit/495c5c8))
- Some fields cannot be overridden from `config.manifest` ([#46](https://github.com/wxt-dev/wxt/pull/46))

## v0.2.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.2.1...v0.2.2)

### 🩹 Fixes

- Register content scripts correctly in dev mode ([2fb5a54](https://github.com/wxt-dev/wxt/commit/2fb5a54))

## v0.2.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.2.0...v0.2.1)

### 🚀 Enhancements

- Support all content script options ([6f5bf89](https://github.com/wxt-dev/wxt/commit/6f5bf89))

### 🩹 Fixes

- Remove HMR log ([90fa6bf](https://github.com/wxt-dev/wxt/commit/90fa6bf))

## v0.2.0

[⚠️ breaking changes](https://wxt.dev/guide/upgrade-guide/wxt) &bull; [compare changes](https://github.com/wxt-dev/wxt/compare/v0.1.6...v0.2.0)

### 🚀 Enhancements

- ⚠️ Rename `defineBackgroundScript` to `defineBackground` ([5b48ae9](https://github.com/wxt-dev/wxt/commit/5b48ae9))
- Recongize unnamed content scripts (`content.ts` and `content/index.ts`) ([3db5cec](https://github.com/wxt-dev/wxt/commit/3db5cec))

### 📖 Documentation

- Update templates ([f28a29e](https://github.com/wxt-dev/wxt/commit/f28a29e))
- Add docs for each type of entrypoint ([77cbfc1](https://github.com/wxt-dev/wxt/commit/77cbfc1))
- Add inline JSDoc for public types ([375a2a6](https://github.com/wxt-dev/wxt/commit/375a2a6))

### 🏡 Chore

- Run `wxt prepare` on `postinstall` ([c1ea9ba](https://github.com/wxt-dev/wxt/commit/c1ea9ba))
- Don't format lockfile ([5c7e041](https://github.com/wxt-dev/wxt/commit/5c7e041))

## v0.1.6

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.1.5...v0.1.6)

### 🩹 Fixes

- Resolve tsconfig paths in vite ([ea92a27](https://github.com/wxt-dev/wxt/commit/ea92a27))
- Add logs when a hot reload happens ([977246f](https://github.com/wxt-dev/wxt/commit/977246f))

### 🏡 Chore

- React and Vue starter templates ([#33](https://github.com/wxt-dev/wxt/pull/33))
- Svelte template ([#34](https://github.com/wxt-dev/wxt/pull/34))

## v0.1.5

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.1.4...v0.1.5)

### 🩹 Fixes

- Include `vite/client` types ([371be99](https://github.com/wxt-dev/wxt/commit/371be99))

## v0.1.4

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.1.3...v0.1.4)

### 🩹 Fixes

- Fix regression where manifest was not listed first in build summary ([fa2b656](https://github.com/wxt-dev/wxt/commit/fa2b656))
- Fix config hook implementations for vite plugins ([49965e7](https://github.com/wxt-dev/wxt/commit/49965e7))

### 📖 Documentation

- Update CLI screenshot ([0a26673](https://github.com/wxt-dev/wxt/commit/0a26673))

### 🏡 Chore

- Update prettier ignore ([68611ae](https://github.com/wxt-dev/wxt/commit/68611ae))

## v0.1.3

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.1.2...v0.1.3)

### 🚀 Enhancements

- Add tsconfig path aliases ([#32](https://github.com/wxt-dev/wxt/pull/32))

### 🩹 Fixes

- Merge `manifest` option from both inline and user config ([05ca998](https://github.com/wxt-dev/wxt/commit/05ca998))
- Cleanup build summary with sourcemaps ([ac0b28e](https://github.com/wxt-dev/wxt/commit/ac0b28e))

### 📖 Documentation

- Create documentation site ([#31](https://github.com/wxt-dev/wxt/pull/31))

### 🏡 Chore

- Upgrade to pnpm 8 ([0ce7c9d](https://github.com/wxt-dev/wxt/commit/0ce7c9d))

## v0.1.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.1.1...v0.1.2)

### 🚀 Enhancements

- Accept a function for `config.manifest` ([ee49837](https://github.com/wxt-dev/wxt/commit/ee49837))

### 🩹 Fixes

- Add missing types for `webextension-polyfill` and the `manifest` option ([636aa48](https://github.com/wxt-dev/wxt/commit/636aa48))
- Only add imports to JS files ([b29c3c6](https://github.com/wxt-dev/wxt/commit/b29c3c6))
- Generate valid type for `EntrypointPath` when there are no entrypoints ([6e7184d](https://github.com/wxt-dev/wxt/commit/6e7184d))

### 🌊 Types

- Change `config.vite` to `UserConfig` ([ef6001e](https://github.com/wxt-dev/wxt/commit/ef6001e))

## v0.1.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.1.0...v0.1.1)

### 🩹 Fixes

- Allow dashes in entrypoint names ([2e51e73](https://github.com/wxt-dev/wxt/commit/2e51e73))
- Unable to read entrypoint options ([#28](https://github.com/wxt-dev/wxt/pull/28))

## v0.1.0

Initial release of WXT. Full support for production builds and initial toolkit for development:

- HMR support when HTML page dependencies change
- Reload extension when background changes
- Reload HTML pages when saving them directly
- Re-register and reload tabs when content scripts change

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.0.2...v0.1.0)

### 🚀 Enhancements

- Content scripts reloading ([#25](https://github.com/wxt-dev/wxt/pull/25))

### 📖 Documentation

- Update feature list ([0255028](https://github.com/wxt-dev/wxt/commit/0255028))

### 🤖 CI

- Create github release ([b7c078f](https://github.com/wxt-dev/wxt/commit/b7c078f))

## v0.0.2

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.0.1...v0.0.2)

### 🚀 Enhancements

- Reload extension when source code is changed ([#17](https://github.com/wxt-dev/wxt/pull/17))
- Setup background script web socket/reload ([#22](https://github.com/wxt-dev/wxt/pull/22))
- Reload HTML files individually ([#23](https://github.com/wxt-dev/wxt/pull/23))

### 🩹 Fixes

- Output chunks to a chunks directory ([2dd7a99](https://github.com/wxt-dev/wxt/commit/2dd7a99))
- Remove hash from content script css outputs ([#20](https://github.com/wxt-dev/wxt/pull/20))
- Overwrite files with the same name when renaming entrypoints in dev mode ([37986bf](https://github.com/wxt-dev/wxt/commit/37986bf))
- Separate template builds to prevent sharing chunks ([7f3a1e8](https://github.com/wxt-dev/wxt/commit/7f3a1e8))
- Show Vite warnings and errors ([c51f0e0](https://github.com/wxt-dev/wxt/commit/c51f0e0))

### 📖 Documentation

- Add milestone progress badge to README ([684197d](https://github.com/wxt-dev/wxt/commit/684197d))
- Fix milestone link in README ([e14f81d](https://github.com/wxt-dev/wxt/commit/e14f81d))

### 🏡 Chore

- Refactor build output type ([#19](https://github.com/wxt-dev/wxt/pull/19))
- Refactor build outputs to support transpiled templates ([a78aada](https://github.com/wxt-dev/wxt/commit/a78aada))
- Rename `templates` to `virtual-modules` ([#24](https://github.com/wxt-dev/wxt/pull/24))
- Update cli screenshot ([54eb118](https://github.com/wxt-dev/wxt/commit/54eb118))

## v0.0.1

[compare changes](https://github.com/wxt-dev/wxt/compare/v0.0.0...v0.0.1)

### 🚀 Enhancements

- Add logger to config ([232ff7a](https://github.com/wxt-dev/wxt/commit/232ff7a))
- Export and bootstrap the `/client` package ([5b07c95](https://github.com/wxt-dev/wxt/commit/5b07c95))
- Resolve entrypoints based on filesystem ([a63f061](https://github.com/wxt-dev/wxt/commit/a63f061))
- Separate output directories for each browser/manifest version ([f09ffbb](https://github.com/wxt-dev/wxt/commit/f09ffbb))
- Build entrypoints and output `manifest.json` ([1e7c738](https://github.com/wxt-dev/wxt/commit/1e7c738))
- Automatically add CSS files to content scripts ([047ce04](https://github.com/wxt-dev/wxt/commit/047ce04))
- Download and bundle remote URL imports ([523c7df](https://github.com/wxt-dev/wxt/commit/523c7df))
- Generate type declarations and config for project types and auto-imports ([21debad](https://github.com/wxt-dev/wxt/commit/21debad))
- Good looking console output ([e2cc995](https://github.com/wxt-dev/wxt/commit/e2cc995))
- Dev server working and a valid extension is built ([505e419](https://github.com/wxt-dev/wxt/commit/505e419))
- Virtualized content script entrypoint ([ca29537](https://github.com/wxt-dev/wxt/commit/ca29537))
- Provide custom, typed globals defined by Vite ([8c59a1c](https://github.com/wxt-dev/wxt/commit/8c59a1c))
- Copy public directory to outputs ([1a25f2b](https://github.com/wxt-dev/wxt/commit/1a25f2b))
- Support browser and chrome styles for mv2 popups ([7945c94](https://github.com/wxt-dev/wxt/commit/7945c94))
- Support browser and chrome styles for mv2 popups ([7abb577](https://github.com/wxt-dev/wxt/commit/7abb577))
- Support more CLI flags for `build` and `dev` ([#9](https://github.com/wxt-dev/wxt/pull/9))
- Add more supported browser types ([f114c5b](https://github.com/wxt-dev/wxt/commit/f114c5b))
- Open browser when starting dev server ([#11](https://github.com/wxt-dev/wxt/pull/11))

### 🩹 Fixes

- Support `srcDir` config ([739d19f](https://github.com/wxt-dev/wxt/commit/739d19f))
- Root path customization now works ([4faa3b3](https://github.com/wxt-dev/wxt/commit/4faa3b3))
- Print durations as ms/s based on total time ([3e37de9](https://github.com/wxt-dev/wxt/commit/3e37de9))
- Don't print error twice when background crashes ([407627c](https://github.com/wxt-dev/wxt/commit/407627c))
- Load package.json from root not cwd ([3ca16ee](https://github.com/wxt-dev/wxt/commit/3ca16ee))
- Only allow a single entrypoint with a given name ([8eb4e86](https://github.com/wxt-dev/wxt/commit/8eb4e86))
- Respect the mv2 popup type ([0f37ceb](https://github.com/wxt-dev/wxt/commit/0f37ceb))
- Respect background type and persistent manifest options ([573ef80](https://github.com/wxt-dev/wxt/commit/573ef80))
- Make content script array orders consistent ([f380378](https://github.com/wxt-dev/wxt/commit/f380378))
- Firefox manifest warnings in dev mode ([50bb845](https://github.com/wxt-dev/wxt/commit/50bb845))

### 📖 Documentation

- Update README ([785ea54](https://github.com/wxt-dev/wxt/commit/785ea54))
- Update README ([99ccadb](https://github.com/wxt-dev/wxt/commit/99ccadb))
- Update description ([07a262e](https://github.com/wxt-dev/wxt/commit/07a262e))
- Update README ([58a0ef4](https://github.com/wxt-dev/wxt/commit/58a0ef4))
- Update README ([23ed6f7](https://github.com/wxt-dev/wxt/commit/23ed6f7))
- Add initial release milestone link to README ([b400e54](https://github.com/wxt-dev/wxt/commit/b400e54))
- Fix typo in README ([5590c9d](https://github.com/wxt-dev/wxt/commit/5590c9d))

### 🏡 Chore

- Refactor cli files into their own directory ([e6c0d84](https://github.com/wxt-dev/wxt/commit/e6c0d84))
- Simplify `BuildOutput` type ([1f6c4a0](https://github.com/wxt-dev/wxt/commit/1f6c4a0))
- Move `.exvite` directory into `srcDir` instead of `root` ([53fb805](https://github.com/wxt-dev/wxt/commit/53fb805))
- Refactor CLI commands ([b8952b6](https://github.com/wxt-dev/wxt/commit/b8952b6))
- Improve build summary sorting ([ec57e8c](https://github.com/wxt-dev/wxt/commit/ec57e8c))
- Remove comments ([e3e9c0d](https://github.com/wxt-dev/wxt/commit/e3e9c0d))
- Refactor internal config creation ([7c634f4](https://github.com/wxt-dev/wxt/commit/7c634f4))
- Check virtual entrypoints feature in README ([70208f4](https://github.com/wxt-dev/wxt/commit/70208f4))
- Add E2E tests and convert to vitest workspace ([5813302](https://github.com/wxt-dev/wxt/commit/5813302))
- Rename package to wxt ([51a1072](https://github.com/wxt-dev/wxt/commit/51a1072))
- Fix header log's timestamp ([8ca5657](https://github.com/wxt-dev/wxt/commit/8ca5657))
- Fix demo global usage ([1ecfedd](https://github.com/wxt-dev/wxt/commit/1ecfedd))
- Refactor folder structure ([9ab3953](https://github.com/wxt-dev/wxt/commit/9ab3953))
- Fix release workflow ([2e94f2a](https://github.com/wxt-dev/wxt/commit/2e94f2a))

### 🤖 CI

- Create validation workflow ([#12](https://github.com/wxt-dev/wxt/pull/12))
- Create release workflow ([#13](https://github.com/wxt-dev/wxt/pull/13))