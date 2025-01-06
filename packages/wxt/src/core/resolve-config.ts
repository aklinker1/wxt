import { loadConfig } from 'c12';
import {
  InlineConfig,
  ResolvedConfig,
  UserConfig,
  ConfigEnv,
  UserManifestFn,
  UserManifest,
  WebExtConfig,
  WxtResolvedUnimportOptions,
  Logger,
  WxtCommand,
  WxtModule,
  WxtModuleWithMetadata,
  ResolvedEslintrc,
} from '../types';
import path from 'node:path';
import { createFsCache } from './utils/cache';
import consola, { LogLevels } from 'consola';
import defu from 'defu';
import { NullablyRequired } from './utils/types';
import fs from 'fs-extra';
import { normalizePath } from './utils/paths';
import glob from 'fast-glob';
import { builtinModules } from '../builtin-modules';
import { getEslintVersion } from './utils/eslint';
import { safeStringToNumber } from './utils/number';
import { loadEnv } from './utils/env';
import { getPort } from 'get-port-please';
import { fileURLToPath } from 'node:url';

/**
 * Given an inline config, discover the config file if necessary, merge the results, resolve any
 * relative paths, and apply any defaults.
 *
 * Inline config always has priority over user config. Cli flags are passed as inline config if set.
 * If unset, undefined is passed in, letting this function decide default values.
 */
export async function resolveConfig(
  inlineConfig: InlineConfig,
  command: WxtCommand,
): Promise<ResolvedConfig> {
  // Load user config

  let userConfig: UserConfig = {};
  let userConfigMetadata: ResolvedConfig['userConfigMetadata'] | undefined;
  if (inlineConfig.configFile !== false) {
    const { config: loadedConfig, ...metadata } = await loadConfig<UserConfig>({
      configFile: inlineConfig.configFile,
      name: 'wxt',
      cwd: inlineConfig.root ?? process.cwd(),
      rcFile: false,
    });
    if (inlineConfig.configFile && metadata.layers?.length === 0) {
      throw Error(`Config file "${inlineConfig.configFile}" not found`);
    }
    userConfig = loadedConfig ?? {};
    userConfigMetadata = metadata;
  }

  // Merge it into the inline config

  const mergedConfig = await mergeInlineConfig(inlineConfig, userConfig);

  // Apply defaults to make internal config.

  const debug = mergedConfig.debug ?? false;
  const logger = mergedConfig.logger ?? consola;
  if (debug) logger.level = LogLevels.debug;

  const browser = mergedConfig.browser ?? 'chrome';
  const manifestVersion =
    mergedConfig.manifestVersion ??
    (browser === 'firefox' || browser === 'safari' ? 2 : 3);
  const mode = mergedConfig.mode ?? COMMAND_MODES[command];
  const env: ConfigEnv = { browser, command, manifestVersion, mode };

  loadEnv(mode, browser); // Load any environment variables used below

  const root = path.resolve(
    inlineConfig.root ?? userConfig.root ?? process.cwd(),
  );
  const wxtDir = path.resolve(root, '.wxt');
  const wxtModuleDir = await resolveWxtModuleDir();
  const srcDir = path.resolve(root, mergedConfig.srcDir ?? root);
  const entrypointsDir = path.resolve(
    srcDir,
    mergedConfig.entrypointsDir ?? 'entrypoints',
  );
  if (await isDirMissing(entrypointsDir)) {
    logMissingDir(logger, 'Entrypoints', entrypointsDir);
  }
  const modulesDir = path.resolve(root, mergedConfig.modulesDir ?? 'modules');
  const filterEntrypoints = mergedConfig.filterEntrypoints?.length
    ? new Set(mergedConfig.filterEntrypoints)
    : undefined;
  const publicDir = path.resolve(root, mergedConfig.publicDir ?? 'public');
  const typesDir = path.resolve(wxtDir, 'types');
  const outBaseDir = path.resolve(root, mergedConfig.outDir ?? '.output');
  const modeSuffixes: Record<string, string | undefined> = {
    production: '',
    development: '-dev',
  };
  const modeSuffix = modeSuffixes[mode] ?? `-${mode}`;
  const outDirTemplate = (
    mergedConfig.outDirTemplate ??
    `${browser}-mv${manifestVersion}${modeSuffix}`
  )
    // Resolve all variables in the template
    .replaceAll('{{browser}}', browser)
    .replaceAll('{{manifestVersion}}', manifestVersion.toString())
    .replaceAll('{{modeSuffix}}', modeSuffix)
    .replaceAll('{{mode}}', mode)
    .replaceAll('{{command}}', command);

  const outDir = path.resolve(outBaseDir, outDirTemplate);
  const reloadCommand = mergedConfig.dev?.reloadCommand ?? 'Alt+R';

  if (inlineConfig.runner != null || userConfig.runner != null) {
    logger.warn(
      '`InlineConfig#runner` is deprecated, use `InlineConfig#webExt` instead. See https://wxt.dev/guide/resources/upgrading.html#v0-19-0-rarr-v0-20-0',
    );
  }
  const runnerConfig = await loadConfig<WebExtConfig>({
    name: 'web-ext',
    cwd: root,
    globalRc: true,
    rcFile: '.webextrc',
    overrides: inlineConfig.webExt ?? inlineConfig.runner,
    defaults: userConfig.webExt ?? userConfig.runner,
  });
  // Make sure alias are absolute
  const alias = Object.fromEntries(
    Object.entries({
      ...mergedConfig.alias,
      '@': srcDir,
      '~': srcDir,
      '@@': root,
      '~~': root,
    }).map(([key, value]) => [key, path.resolve(root, value)]),
  );

  let devServerConfig: ResolvedConfig['dev']['server'];
  if (command === 'serve') {
    const hostname = mergedConfig.dev?.server?.hostname ?? 'localhost';
    let port = mergedConfig.dev?.server?.port;
    if (port == null || !isFinite(port)) {
      port = await getPort({
        port: 3000,
        portRange: [3001, 3010],
        // Passing host required for Mac, unsure of Windows/Linux
        host: hostname,
      });
    }
    devServerConfig = {
      port,
      hostname,
      watchDebounce: safeStringToNumber(process.env.WXT_WATCH_DEBOUNCE) ?? 800,
    };
  }

  const userModules = await resolveWxtUserModules(
    modulesDir,
    mergedConfig.modules,
  );
  const moduleOptions = userModules.reduce<Record<string, any>>(
    (map, module) => {
      if (module.configKey) {
        map[module.configKey] =
          // @ts-expect-error
          mergedConfig[module.configKey];
      }
      return map;
    },
    {},
  );

  return {
    browser,
    command,
    debug,
    entrypointsDir,
    modulesDir,
    filterEntrypoints,
    env,
    fsCache: createFsCache(wxtDir),
    imports: await getUnimportOptions(wxtDir, srcDir, logger, mergedConfig),
    logger,
    manifest: await resolveManifestConfig(env, mergedConfig.manifest),
    manifestVersion,
    mode,
    outBaseDir,
    outDir,
    publicDir,
    wxtModuleDir,
    root,
    runnerConfig,
    srcDir,
    typesDir,
    wxtDir,
    zip: resolveZipConfig(root, browser, outBaseDir, mergedConfig),
    analysis: resolveAnalysisConfig(root, mergedConfig),
    userConfigMetadata: userConfigMetadata ?? {},
    alias,
    experimental: defu(mergedConfig.experimental, {}),
    dev: {
      server: devServerConfig,
      reloadCommand,
    },
    hooks: mergedConfig.hooks ?? {},
    vite: mergedConfig.vite ?? (() => ({})),
    builtinModules,
    userModules,
    plugins: [],
    ...moduleOptions,
  };
}

async function resolveManifestConfig(
  env: ConfigEnv,
  manifest: UserManifest | Promise<UserManifest> | UserManifestFn | undefined,
): Promise<UserManifest> {
  return typeof manifest === 'function'
    ? await manifest(env)
    : await (manifest ?? {});
}

/**
 * Merge the inline config and user config. Inline config is given priority. Defaults are not applied here.
 */
async function mergeInlineConfig(
  inlineConfig: InlineConfig,
  userConfig: UserConfig,
): Promise<InlineConfig> {
  // Merge imports option
  const imports: InlineConfig['imports'] =
    inlineConfig.imports === false || userConfig.imports === false
      ? false
      : userConfig.imports == null && inlineConfig.imports == null
        ? undefined
        : defu(inlineConfig.imports ?? {}, userConfig.imports ?? {});

  // Merge manifest option
  const manifest: UserManifestFn = async (env) => {
    const user = await resolveManifestConfig(env, userConfig.manifest);
    const inline = await resolveManifestConfig(env, inlineConfig.manifest);
    return defu(inline, user);
  };

  const merged = defu(inlineConfig, userConfig);

  // Builders
  const builderConfig = await mergeBuilderConfig(
    merged.logger ?? consola,
    inlineConfig,
    userConfig,
  );

  return {
    ...merged,
    // Custom merge values
    imports,
    manifest,
    ...builderConfig,
  };
}

function resolveZipConfig(
  root: string,
  browser: string,
  outBaseDir: string,
  mergedConfig: InlineConfig,
): NullablyRequired<ResolvedConfig['zip']> {
  const downloadedPackagesDir = path.resolve(root, '.wxt/local_modules');
  return {
    name: undefined,
    sourcesTemplate: '{{name}}-{{version}}-sources.zip',
    artifactTemplate: '{{name}}-{{version}}-{{browser}}.zip',
    sourcesRoot: root,
    includeSources: [],
    compressionLevel: 9,
    ...mergedConfig.zip,
    zipSources:
      mergedConfig.zip?.zipSources ?? ['firefox', 'opera'].includes(browser),
    exclude: mergedConfig.zip?.exclude ?? [],
    excludeSources: [
      '**/node_modules',
      // WXT files
      '**/web-ext.config.ts',
      // Hidden files
      '**/.*',
      // Tests
      '**/__tests__/**',
      '**/*.+(test|spec).?(c|m)+(j|t)s?(x)',
      // Output directory
      `${path.relative(root, outBaseDir)}/**`,
      // From user
      ...(mergedConfig.zip?.excludeSources ?? []),
    ],
    downloadPackages: mergedConfig.zip?.downloadPackages ?? [],
    downloadedPackagesDir,
  };
}

function resolveAnalysisConfig(
  root: string,
  mergedConfig: InlineConfig,
): NullablyRequired<ResolvedConfig['analysis']> {
  const analysisOutputFile = path.resolve(
    root,
    mergedConfig.analysis?.outputFile ?? 'stats.html',
  );
  const analysisOutputDir = path.dirname(analysisOutputFile);
  const analysisOutputName = path.parse(analysisOutputFile).name;

  return {
    enabled: mergedConfig.analysis?.enabled ?? false,
    open: mergedConfig.analysis?.open ?? false,
    template: mergedConfig.analysis?.template ?? 'treemap',
    outputFile: analysisOutputFile,
    outputDir: analysisOutputDir,
    outputName: analysisOutputName,
    keepArtifacts: mergedConfig.analysis?.keepArtifacts ?? false,
  };
}

async function getUnimportOptions(
  wxtDir: string,
  srcDir: string,
  logger: Logger,
  config: InlineConfig,
): Promise<WxtResolvedUnimportOptions> {
  const disabled = config.imports === false;
  const eslintrc = await getUnimportEslintOptions(wxtDir, config.imports);
  // mlly sometimes picks up things as exports that aren't. That's what this array contains.
  const invalidExports = ['options'];

  const defineImportsAndTypes = (imports: string[], typeImports: string[]) => [
    ...imports,
    ...typeImports.map((name) => ({ name, type: true })),
  ];

  const defaultOptions: WxtResolvedUnimportOptions = {
    imports: [{ name: 'fakeBrowser', from: 'wxt/testing' }],
    presets: [
      {
        from: 'wxt/browser',
        imports: defineImportsAndTypes(['browser'], []),
      },
      {
        from: 'wxt/utils/storage',
        imports: defineImportsAndTypes(
          ['storage'],
          [
            'StorageArea',
            'WxtStorage',
            'WxtStorageItem',
            'StorageArea',
            'StorageItemKey',
            'StorageAreaChanges',
            'MigrationError',
          ],
        ),
      },
      {
        from: 'wxt/utils/app-config',
        imports: defineImportsAndTypes(['useAppConfig'], []),
      },
      {
        from: 'wxt/utils/content-script-context',
        imports: defineImportsAndTypes(
          ['ContentScriptContext'],
          ['WxtWindowEventMap'],
        ),
      },
      {
        from: 'wxt/utils/content-script-ui/iframe',
        imports: defineImportsAndTypes(
          ['createIframeUi'],
          ['IframeContentScriptUi', 'IframeContentScriptUiOptions'],
        ),
        ignore: invalidExports,
      },
      {
        from: 'wxt/utils/content-script-ui/integrated',
        imports: defineImportsAndTypes(
          ['createIntegratedUi'],
          ['IntegratedContentScriptUi', 'IntegratedContentScriptUiOptions'],
        ),
        ignore: invalidExports,
      },
      {
        from: 'wxt/utils/content-script-ui/shadow-root',
        imports: defineImportsAndTypes(
          ['createShadowRootUi'],
          ['ShadowRootContentScriptUi', 'ShadowRootContentScriptUiOptions'],
        ),
        ignore: invalidExports,
      },
      {
        from: 'wxt/utils/content-script-ui/types',
        imports: defineImportsAndTypes(
          [],
          [
            'ContentScriptUi',
            'ContentScriptUiOptions',
            'ContentScriptOverlayAlignment',
            'ContentScriptAppendMode',
            'ContentScriptInlinePositioningOptions',
            'ContentScriptOverlayPositioningOptions',
            'ContentScriptModalPositioningOptions',
            'ContentScriptPositioningOptions',
            'ContentScriptAnchoredOptions',
            'AutoMountOptions',
            'StopAutoMount',
            'AutoMount',
          ],
        ),
      },
      {
        from: 'wxt/utils/define-app-config',
        imports: defineImportsAndTypes(['defineAppConfig'], ['WxtAppConfig']),
      },
      {
        from: 'wxt/utils/define-background',
        imports: defineImportsAndTypes(['defineBackground'], []),
      },
      {
        from: 'wxt/utils/define-content-script',
        imports: defineImportsAndTypes(['defineContentScript'], []),
      },
      {
        from: 'wxt/utils/define-unlisted-script',
        imports: defineImportsAndTypes(['defineUnlistedScript'], []),
      },
      {
        from: 'wxt/utils/define-wxt-plugin',
        imports: defineImportsAndTypes(['defineWxtPlugin'], []),
      },
      {
        from: 'wxt/utils/inject-script',
        imports: defineImportsAndTypes(
          ['injectScript'],
          ['ScriptPublicPath', 'InjectScriptOptions'],
        ),
        ignore: invalidExports,
      },
      {
        from: 'wxt/utils/match-patterns',
        imports: defineImportsAndTypes(
          ['InvalidMatchPattern', 'MatchPattern'],
          [],
        ),
      },
    ],
    virtualImports: ['#imports'],
    debugLog: logger.debug,
    warn: logger.warn,
    dirsScanOptions: {
      cwd: srcDir,
    },
    eslintrc,
    dirs: disabled ? [] : ['components', 'composables', 'hooks', 'utils'],
    disabled,
  };

  return defu<WxtResolvedUnimportOptions, [WxtResolvedUnimportOptions]>(
    config.imports ?? {},
    defaultOptions,
  );
}

async function getUnimportEslintOptions(
  wxtDir: string,
  options: InlineConfig['imports'],
): Promise<ResolvedEslintrc> {
  const inlineEnabled =
    options === false ? false : (options?.eslintrc?.enabled ?? 'auto');

  let enabled: ResolvedEslintrc['enabled'];
  switch (inlineEnabled) {
    case 'auto':
      const version = await getEslintVersion();
      let major = parseInt(version[0]);
      if (isNaN(major)) enabled = false;
      if (major <= 8) enabled = 8;
      else if (major >= 9) enabled = 9;
      // NaN
      else enabled = false;
      break;
    case true:
      enabled = 8;
      break;
    default:
      enabled = inlineEnabled;
  }

  return {
    enabled,
    filePath: path.resolve(
      wxtDir,
      enabled === 9 ? 'eslint-auto-imports.mjs' : 'eslintrc-auto-import.json',
    ),
    globalsPropValue: true,
  };
}

/**
 * Returns the path to `node_modules/wxt`.
 */
async function resolveWxtModuleDir() {
  const url = import.meta.resolve('wxt', import.meta.url);
  // resolve() returns the "wxt/dist/index.mjs" file, not the package's root
  // directory, which we want to return from this function.
  return path.resolve(fileURLToPath(url), '../..');
}

async function isDirMissing(dir: string) {
  return !(await fs.exists(dir));
}

function logMissingDir(logger: Logger, name: string, expected: string) {
  logger.warn(
    `${name} directory not found: ./${normalizePath(
      path.relative(process.cwd(), expected),
    )}`,
  );
}

/**
 * Map of `ConfigEnv` commands to their default modes.
 */
const COMMAND_MODES: Record<WxtCommand, string> = {
  build: 'production',
  serve: 'development',
};

export async function mergeBuilderConfig(
  logger: Logger,
  inlineConfig: InlineConfig,
  userConfig: UserConfig,
): Promise<Pick<InlineConfig, 'vite'>> {
  const vite = await import('vite').catch((err) => {
    logger.debug('Failed to import vite:', err);
  });
  if (vite) {
    return {
      vite: async (env) => {
        const resolvedInlineConfig = (await inlineConfig.vite?.(env)) ?? {};
        const resolvedUserConfig = (await userConfig.vite?.(env)) ?? {};
        return vite.mergeConfig(resolvedUserConfig, resolvedInlineConfig);
      },
    };
  }

  throw Error('Builder not found. Make sure vite is installed.');
}

export async function resolveWxtUserModules(
  modulesDir: string,
  modules: string[] = [],
): Promise<WxtModuleWithMetadata<any>[]> {
  // Resolve node_modules modules
  const npmModules = await Promise.all<WxtModuleWithMetadata<any>>(
    modules.map(async (moduleId) => {
      const mod: { default: WxtModule<any> } = await import(
        /* @vite-ignore */ moduleId
      );
      if (mod.default == null) {
        throw Error('Module missing default export: ' + moduleId);
      }
      return {
        ...mod.default,
        type: 'node_module',
        id: moduleId,
      };
    }),
  );

  // Resolve local file paths
  const localModulePaths = await glob(['*.[tj]s', '*/index.[tj]s'], {
    cwd: modulesDir,
    onlyFiles: true,
  }).catch(() => []);
  // Sort modules to ensure a consistent execution order
  localModulePaths.sort();
  const localModules = await Promise.all<WxtModuleWithMetadata<any>>(
    localModulePaths.map(async (file) => {
      const absolutePath = normalizePath(path.resolve(modulesDir, file));
      const { config } = await loadConfig<WxtModule<any>>({
        configFile: absolutePath,
        globalRc: false,
        rcFile: false,
        packageJson: false,
        envName: false,
        dotenv: false,
      });
      if (config == null)
        throw Error(
          `No config found for ${file}. Did you forget to add a default export?`,
        );
      // Add name based on filename
      config.name ??= file;
      return {
        ...config,
        type: 'local',
        id: absolutePath,
      };
    }),
  );
  return [...npmModules, ...localModules];
}

// Mock `import.meta.resolve` in tests
// @ts-expect-error
if (typeof __vite_ssr_import_meta__ !== 'undefined') {
  // @ts-expect-error: Untyped global defined by Vitest
  __vite_ssr_import_meta__.resolve = (path: string) =>
    // @ts-expect-error: vitestCreateRequire defined in vitest.setup.ts
    'file://' + vitestCreateRequire(import.meta.url).resolve(path);
}
