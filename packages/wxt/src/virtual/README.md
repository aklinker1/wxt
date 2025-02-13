# WXT Virtual Entrypoints

This folder contains scripts that are either loaded as entrypoints to JS files or included in HTML files, just like a project using WXT might load their own scripts.

While they are bundled and shipped inside WXT, Vite considers them a part of your project's source code, not WXT's. This means they cannot import 3rd party modules directly, otherwise `pnpm i --shamefully-hoist=false` and Yarn PnP will fail.

For this reason, the virtual entrypoints get their own TS project to isolate them from the rest of the project. They can only import from `wxt/*` or utils that don't have any imports from node_modules, like the logger.

When bundling WXT for publishing to NPM, all the `wxt/*` imports are marked as external and resolved when building your application. Other imports are added inline.

See <https://github.com/wxt-dev/wxt/issues/286#issuecomment-1858888390> for more details.
