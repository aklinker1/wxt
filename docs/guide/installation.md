# Installation

Bootstrap a new project, start from scratch, or [migrate an existing project](/guide/resources/migrate).

[[toc]]

## Bootstrap Project

Run the [`init` command](/api/cli/wxt-init), and follow the instructions.

:::code-group

```sh [PNPM]
pnpm dlx wxt@latest init
```

```sh [Bun]
bunx wxt@latest init
```

```sh [NPM]
npx wxt@latest init
```

```sh [Yarn]
# Use NPM initially, but select Yarn when prompted
npx wxt@latest init
```

:::

:::info Starter Templates:
[<Icon name="TypeScript" style="margin-left: 16px;" />Vanilla](https://github.com/wxt-dev/wxt/tree/main/templates/vanilla)<br/>[<Icon name="Vue" style="margin-left: 16px;" />Vue](https://github.com/wxt-dev/wxt/tree/main/templates/vue)<br/>[<Icon name="React" style="margin-left: 16px;" />React](https://github.com/wxt-dev/wxt/tree/main/templates/react)<br/>[<Icon name="Svelte" style="margin-left: 16px;" />Svelte](https://github.com/wxt-dev/wxt/tree/main/templates/svelte)<br/>[<Icon name="Solid" icon="https://www.solidjs.com/img/favicons/favicon-32x32.png"  style="margin-left: 16px;" />Solid](https://github.com/wxt-dev/wxt/tree/main/templates/solid)

<small style="opacity: 50%">All templates use TypeScript by default. To use JavaScript, change the file extensions.</small>
:::

### Demo

![wxt init demo](/assets/init-demo.gif)

Once you've run the `dev` command, continue to [Next Steps](#next-steps)!

## From Scratch

1. Create a new project
   :::code-group

   ```sh [PNPM]
   cd my-project
   pnpm init
   ```

   ```sh [Bun]
   cd my-project
   bun init
   ```

   ```sh [NPM]
   cd my-project
   npm init
   ```

   ```sh [Yarn]
   cd my-project
   yarn init
   ```

   :::

2. Install WXT:
   :::code-group

   ```sh [PNPM]
   pnpm i -D wxt
   ```

   ```sh [Bun]
   bun i -D wxt
   ```

   ```sh [NPM]
   npm i -D wxt
   ```

   ```sh [Yarn]
   yarn add --dev wxt
   ```

   :::

3. Add an entrypoint, `my-project/entrypoints/background.ts`:
   :::code-group

   ```ts
   export default defineBackground(() => {
     console.log('Hello world!');
   });
   ```

   :::

4. Add scripts to your `package.json`:

   ```json
   {
     "scripts": {
       "dev": "wxt", // [!code ++]
       "dev:firefox": "wxt -b firefox", // [!code ++]
       "build": "wxt build", // [!code ++]
       "build:firefox": "wxt build -b firefox", // [!code ++]
       "zip": "wxt zip", // [!code ++]
       "zip:firefox": "wxt zip -b firefox", // [!code ++]
       "postinstall": "wxt prepare" // [!code ++]
     }
   }
   ```

5. Run your extension in dev mode
   :::code-group

   ```sh [PNPM]
   pnpm dev
   ```

   ```sh [Bun]
   bun run dev
   ```

   ```sh [NPM]
   npm run dev
   ```

   ```sh [Yarn]
   yarn dev
   ```

   :::
   WXT will automatically open a browser window with your extension installed.

## Next Steps

- Keep reading on about WXT's [Project Structure](/guide/essentials/project-structure) and other essential concepts to learn
- Configure [automatic browser startup](/guide/essentials/config/browser-startup) during dev mode
- Explore [WXT's example library](/examples) to see how to use specific APIs or perform common tasks
- Checkout the [community page](/guide/resources/community) for a list of resources made by the community!
