# Contributing

Everyone is welcome to contribute to **WXT**!

If you are changing the docs or fixing a bug, feel free to fork and open a PR.

If you want to add a new feature, please create an issue or discussion first so we can decide if the feature is inline with the vision for WXT.

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/en) to automate versioning. If you're a new contributor, don't worry about this. When you open a PR, a maintainer will change the PR's title so it's in the style of conventional commits, but that's all.

Maintainers, commits to the `main` branch (either directly or via PRs) must be valid conventional commits.

## Setup

WXT uses `pnpm`, so make sure you have it installed.

```sh
corepack enable
```

Then, simply run the install command:

```sh
pnpm i
```

## Development

Here are some helpful commands:

```sh
# Build WXT package
cd packages/wxt
pnpm build
```

```sh
# Build WXT package, then build demo extension
cd packages/wxt-demo
pnpm build
```

```sh
# Build WXT package, then start the demo extension in dev mode
cd packages/wxt-demo
pnpm dev
```

```sh
# Run unit and E2E tests
pnpm test
```

```sh
# Start the docs website locally
pnpm docs:dev
```

## Profiling

```sh
# Build the latest version
pnpm --filter wxt build

# CD to the demo directory
cd packages/wxt-demo

# 1. Generate a flamechart with 0x
pnpm dlx 0x node_modules/wxt/bin/wxt.mjs build
# 2. Inspect the process with chrome @ chrome://inspect
pnpm node --inspect node_modules/wxt/bin/wxt.mjs build
```

## Updating Docs

Documentation is written with VitePress, and is located in the `docs/` directory.

The API reference is generated from JSDoc comments in the source code. If there's a typo or change you want to make in there, you'll need to update the source code instead of a file in the `docs/` directory.

## Testing

WXT has unit and E2E tests. When making a change or adding a feature, make sure to update the tests or add new ones, if they exist.

> If they don't exist, feel free to create them, but that's a lot for a one-time contributor. A maintainer might add them to your PR though.

To run tests for a specific file, add the filename at the end of the test command:

```sh
pnpm test manifest-contents
```

All test (unit and E2E) for all packages are ran together via [Vitest workspaces](https://vitest.dev/guide/#workspaces-support).

If you want to manually test a change, you can modify the demo project for your test, but please don't leave those changes committed once you open a PR.

## Templates

Each directory inside `templates/` is it's own standalone project. Simply `cd` into the directory you're updating, install dependencies with `npm` (NOT `pnpm`), and run the relevant commands

```sh
cd templates/vue
npm i
npm run dev
npm run build
```

Note that templates are hardcoded to a specific version of `wxt` from NPM, they do not use the local version. PR checks will test your PR's changes against the templates, but if you want to manually do it, update the package.json dependency:

```diff
  "devDependencies": {
    "typescript": "^5.3.2",
    "vite-plugin-solid": "^2.7.0",
-   "wxt": "^0.8.0"
+   "wxt": "../.."
  }
```

Then run `npm i` again.

### Adding Templates

To add a template, copy the vanilla template and give it a new name.

```sh
cp -r templates/vanilla templates/<new-template-name>
```

That's it. Once your template is merged, it will be available inside `wxt init` immediately. You don't need to release a new version of WXT to release a new template.

## Releasing Updates

Releases are done with GitHub actions:

- Use the [Release workflow](https://github.com/wxt-dev/wxt/actions/workflows/release.yml) to release a single package in the monorepo. This automatically detects the version change with conventional commits, builds and uploads the package to NPM, and creates a GitHub release.
- Use the [Sync Releases workflow](https://github.com/wxt-dev/wxt/actions/workflows/sync-releases.yml) to sync the GitHub releases with changes to the changelog. To change a release, update the `CHANGELOG.md` file and run the workflow. It will sync the releases of a single package in the monorepo.

## Upgrading Dependencies

Use [`taze`](https://www.npmjs.com/package/taze) to upgrade dependencies throughout the entire monorepo.

```sh
pnpm dlx taze -r
```

Configuration is in [`taze.config.ts`](./taze.config.ts).

## Install Unreleased Versions

This repo uses https://pkg.pr.new to publish versions of all it's packages for almost every commit. You can install them via:

```sh
npm i https://pkg.pr.new/[package-name]@[ref]
```

Or use one of the shorthands:

```sh
# Install the latest build of `wxt` from a PR:
npm i https://pkg.pr.new/wxt@1283

# Install the latest build of `@wxt-dev/module-react` on the `main` branch
npm i https://pkg.pr.new/@wxt-dev/module-react@main

# Install `@wxt-dev/storage` from a specific commit:
npm i https://pkg.pr.new/@wxt-dev/module-react@426f907
```

## Blog Posts

Anyone is welcome to submit a blog post on https://wxt.dev/blog!

> [!NOTE]
> Before starting on a blog post, please message Aaron on Discord or start a discussion on GitHub to get permission to write about a topic, but most topics are welcome: Major version updates, tutorials, etc.

- **English only**: Blog posts should be written in English. Unfortunately, our maintainers doesn't have the bandwidth right now to translate our docs, let alone blog posts. Sorry 😓
- **AI**: Please only use AI to translate or proof-read your blog post. Don't generate the whole thing... We don't want to publish that.
