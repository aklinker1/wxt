import { debounce } from 'perfect-debounce';
import {
  BuildStepOutput,
  EntrypointGroup,
  InlineConfig,
  ServerInfo,
  WxtDevServer,
} from '../types';
import { getEntrypointBundlePath, isHtmlEntrypoint } from './utils/entrypoints';
import {
  getContentScriptCssFiles,
  getContentScriptsCssMap,
} from './utils/manifest';
import {
  internalBuild,
  detectDevChanges,
  rebuild,
  findEntrypoints,
} from './utils/building';
import { createExtensionRunner } from './runners';
import { Mutex } from 'async-mutex';
import pc from 'picocolors';
import { relative } from 'node:path';
import { deinitWxtModules, initWxtModules, registerWxt, wxt } from './wxt';
import { unnormalizePath } from './utils/paths';
import {
  getContentScriptJs,
  mapWxtOptionsToRegisteredContentScript,
} from './utils/content-scripts';
import { createKeyboardShortcuts } from './keyboard-shortcuts';

/**
 * Creates a dev server and pre-builds all the files that need to exist before loading the extension.
 *
 * @example
 * const server = await wxt.createServer({
 *   // Enter config...
 * });
 * await server.start();
 */
export async function createServer(
  inlineConfig?: InlineConfig,
): Promise<WxtDevServer> {
  await registerWxt('serve', inlineConfig);

  wxt.server = await createServerInternal();
  await wxt.hooks.callHook('server:created', wxt, wxt.server);
  return wxt.server;
}

async function createServerInternal(): Promise<WxtDevServer> {
  const getServerInfo = (): ServerInfo => {
    const { host, port, origin } = wxt.config.dev.server!;
    return { host, port, origin };
  };

  let [runner, builderServer] = await Promise.all([
    createExtensionRunner(),
    wxt.builder.createServer(getServerInfo()),
  ]);

  // Used to track if modules need to be re-initialized
  let wasStopped = false;

  // Server instance must be created first so its reference can be added to the internal config used
  // to pre-render entrypoints
  const server: WxtDevServer = {
    get host() {
      return getServerInfo().host;
    },
    get port() {
      return getServerInfo().port;
    },
    get origin() {
      return getServerInfo().origin;
    },
    get watcher() {
      return builderServer.watcher;
    },
    get ws() {
      return builderServer.ws;
    },
    currentOutput: undefined,
    async start() {
      if (wasStopped) {
        await wxt.reloadConfig();
        runner = await createExtensionRunner();
        builderServer = await wxt.builder.createServer(getServerInfo());
        await initWxtModules();
      }

      await builderServer.listen();
      wxt.logger.success(`Started dev server @ ${server.origin}`);
      await wxt.hooks.callHook('server:started', wxt, server);

      // Register content scripts for the first time after the background starts
      // up since they're not listed in the manifest.
      // Add listener before opening the browser to guarantee it is present when
      // the extension sends back the initialization message.
      server.ws.on('wxt:background-initialized', () => {
        if (server.currentOutput == null) return;
        reloadContentScripts(server.currentOutput.steps, server);
      });

      await buildAndOpenBrowser();

      // Listen for file changes and reload different parts of the extension accordingly
      const reloadOnChange = createFileReloader(server);
      server.watcher.on('all', reloadOnChange);
      keyboardShortcuts.start();
      keyboardShortcuts.printHelp({
        canReopenBrowser:
          !wxt.config.runnerConfig.config.disabled && !!runner.canOpen?.(),
      });
    },

    async stop() {
      wasStopped = true;
      keyboardShortcuts.stop();
      await runner.closeBrowser();
      await builderServer.close();
      await wxt.hooks.callHook('server:closed', wxt, server);

      deinitWxtModules();
      server.currentOutput = undefined;
    },
    async restart() {
      await server.stop();
      await server.start();
    },
    transformHtml(url, html, originalUrl) {
      return builderServer.transformHtml(url, html, originalUrl);
    },
    reloadContentScript(payload) {
      server.ws.send('wxt:reload-content-script', payload);
    },
    reloadPage(path) {
      server.ws.send('wxt:reload-page', path);
    },
    reloadExtension() {
      server.ws.send('wxt:reload-extension');
    },
    async restartBrowser() {
      await runner.closeBrowser();
      keyboardShortcuts.stop();
      await wxt.reloadConfig();
      runner = await createExtensionRunner();
      await runner.openBrowser();
      keyboardShortcuts.start();
    },
  };
  const keyboardShortcuts = createKeyboardShortcuts(server);

  const buildAndOpenBrowser = async () => {
    // Build after starting the dev server so it can be used to transform HTML files
    server.currentOutput = await internalBuild();

    // Add file watchers for files not loaded by the dev server. See
    // https://github.com/wxt-dev/wxt/issues/428#issuecomment-1944731870
    try {
      server.watcher.add(getExternalOutputDependencies(server));
    } catch (err) {
      wxt.config.logger.warn('Failed to register additional file paths:', err);
    }

    // Open browser after everything is ready to go.
    await runner.openBrowser();
  };

  builderServer.on?.('close', () => keyboardShortcuts.stop());

  return server;
}

/**
 * Returns a function responsible for reloading different parts of the extension when a file
 * changes.
 */
function createFileReloader(server: WxtDevServer) {
  const fileChangedMutex = new Mutex();
  const changeQueue: Array<[string, string]> = [];

  const cb = async (event: string, path: string) => {
    changeQueue.push([event, path]);

    await fileChangedMutex.runExclusive(async () => {
      if (server.currentOutput == null) return;

      const fileChanges = changeQueue
        .splice(0, changeQueue.length)
        .map(([_, file]) => file);
      if (fileChanges.length === 0) return;

      await wxt.reloadConfig();

      const changes = detectDevChanges(fileChanges, server.currentOutput);
      if (changes.type === 'no-change') return;

      if (changes.type === 'full-restart') {
        wxt.logger.info('Config changed, restarting server...');
        server.restart();
        return;
      }

      if (changes.type === 'browser-restart') {
        wxt.logger.info('Runner config changed, restarting browser...');
        server.restartBrowser();
        return;
      }

      // Log the entrypoints that were effected
      wxt.logger.info(
        `Changed: ${Array.from(new Set(fileChanges))
          .map((file) => pc.dim(relative(wxt.config.root, file)))
          .join(', ')}`,
      );

      // Rebuild entrypoints on change
      const allEntrypoints = await findEntrypoints();
      try {
        const { output: newOutput } = await rebuild(
          allEntrypoints,
          // TODO: this excludes new entrypoints, so they're not built until the dev command is restarted
          changes.rebuildGroups,
          changes.cachedOutput,
        );
        server.currentOutput = newOutput;

        // Perform reloads
        switch (changes.type) {
          case 'extension-reload':
            server.reloadExtension();
            wxt.logger.success(`Reloaded extension`);
            break;
          case 'html-reload':
            const { reloadedNames } = reloadHtmlPages(
              changes.rebuildGroups,
              server,
            );
            wxt.logger.success(`Reloaded: ${getFilenameList(reloadedNames)}`);
            break;
          case 'content-script-reload':
            reloadContentScripts(changes.changedSteps, server);

            const rebuiltNames = changes.rebuildGroups
              .flat()
              .map((entry) => entry.name);
            wxt.logger.success(`Reloaded: ${getFilenameList(rebuiltNames)}`);
            break;
        }
      } catch {
        // Catch build errors instead of crashing. Don't log error either, builder should have already logged it
      }
    });
  };

  return debounce(cb, wxt.config.dev.server!.watchDebounce, {
    leading: true,
    trailing: false,
  });
}

/**
 * From the server, tell the client to reload content scripts from the provided build step outputs.
 */
function reloadContentScripts(steps: BuildStepOutput[], server: WxtDevServer) {
  if (wxt.config.manifestVersion === 3) {
    steps.forEach((step) => {
      if (server.currentOutput == null) return;

      const entry = step.entrypoints;
      if (Array.isArray(entry) || entry.type !== 'content-script') return;

      const js = getContentScriptJs(wxt.config, entry);
      const cssMap = getContentScriptsCssMap(server.currentOutput, [entry]);
      const css = getContentScriptCssFiles([entry], cssMap);

      server.reloadContentScript({
        registration: entry.options.registration,
        contentScript: mapWxtOptionsToRegisteredContentScript(
          entry.options,
          js,
          css,
        ),
      });
    });
  } else {
    server.reloadExtension();
  }
}

function reloadHtmlPages(
  groups: EntrypointGroup[],
  server: WxtDevServer,
): { reloadedNames: string[] } {
  // groups might contain other files like background/content scripts, and we only care about the HTMl pages
  const htmlEntries = groups.flat().filter(isHtmlEntrypoint);

  htmlEntries.forEach((entry) => {
    const path = getEntrypointBundlePath(entry, wxt.config.outDir, '.html');
    server.reloadPage(path);
  });

  return {
    reloadedNames: htmlEntries.map((entry) => entry.name),
  };
}

function getFilenameList(names: string[]): string {
  return names
    .map((name) => {
      return pc.cyan(name);
    })
    .join(pc.dim(', '));
}

/**
 * Based on the current build output, return a list of files that are:
 * 1. Not in node_modules
 * 2. Not inside project root
 */
function getExternalOutputDependencies(server: WxtDevServer) {
  return (
    server.currentOutput?.steps
      .flatMap((step, i) => {
        if (Array.isArray(step.entrypoints) && i === 0) {
          // Dev server is already watching all HTML/esm files
          return [];
        }

        return step.chunks.flatMap((chunk) => {
          if (chunk.type === 'asset') return [];
          return chunk.moduleIds;
        });
      })
      .filter(
        (file) => !file.includes('node_modules') && !file.startsWith('\x00'),
      )
      .map(unnormalizePath)
      .filter((file) => !file.startsWith(wxt.config.root)) ?? []
  );
}
