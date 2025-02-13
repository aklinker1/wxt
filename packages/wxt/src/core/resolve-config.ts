import { loadConfig } from 'c12';
import { resolve as esmResolve } from 'import-meta-resolve';
import {
  InlineConfig,
  ResolvedConfig,
  UserConfig,
  ConfigEnv,
  UserManifestFn,
  UserManifest,
  ExtensionRunnerConfig,
  WxtResolvedUnimportOptions,
  Logger,
  WxtCommand,
  WxtModule,
  WxtModuleWithMetadata,
  ResolvedEslintrc,
  Eslintrc,
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
import { fileURLToPath, pathToFileURL } from 'node:url';

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
      jitiOptions: {
        esmResolve: true,
      },
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
  const wxtModuleDir = resolveWxtModuleDir();
  const srcDir = path.resolve(root, mergedConfig.srcDir ?? root);
  const entrypointsDir = path.resolve(
    srcDir,
    mergedConfig.entrypointsDir ?? 'entrypoints',
  );
  const modulesDir = path.resolve(srcDir, mergedConfig.modulesDir ?? 'modules');
  if (await isDirMissing(entrypointsDir)) {
    logMissingDir(logger, 'Entrypoints', entrypointsDir);
  }
  const filterEntrypoints = mergedConfig.filterEntrypoints?.length
    ? new Set(mergedConfig.filterEntrypoints)
    : undefined;
  const publicDir = path.resolve(srcDir, mergedConfig.publicDir ?? 'public');
  const typesDir = path.resolve(wxtDir, 'types');
  const outBaseDir = path.resolve(root, mergedConfig.outDir ?? '.output');
  const modeSuffixes: Record<string, string | undefined> = {
    production: '',
    development: '-dev',
  };
  const outDirTemplate = (
    mergedConfig.outDirTemplate ?? `${browser}-mv${manifestVersion}`
  )
    // Resolve all variables in the template
    .replaceAll('{{browser}}', browser)
    .replaceAll('{{manifestVersion}}', manifestVersion.toString())
    .replaceAll('{{modeSuffix}}', modeSuffixes[mode] ?? `-${mode}`)
    .replaceAll('{{mode}}', mode)
    .replaceAll('{{command}}', command);

  const outDir = path.resolve(outBaseDir, outDirTemplate);
  const reloadCommand = mergedConfig.dev?.reloadCommand ?? 'Alt+R';

  const runnerConfig = await loadConfig<ExtensionRunnerConfig>({
    name: 'web-ext',
    cwd: root,
    globalRc: true,
    rcFile: '.webextrc',
    overrides: inlineConfig.runner,
    defaults: userConfig.runner,
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
    root,
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

  const extensionApi = mergedConfig.extensionApi ?? 'webextension-polyfill';

  return {
    browser,
    command,
    debug,
    entrypointsDir,
    modulesDir,
    filterEntrypoints,
    env,
    fsCache: createFsCache(wxtDir),
    imports: await getUnimportOptions(
      wxtDir,
      srcDir,
      logger,
      extensionApi,
      mergedConfig,
    ),
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
    transformManifest: mergedConfig.transformManifest,
    analysis: resolveAnalysisConfig(root, mergedConfig),
    userConfigMetadata: userConfigMetadata ?? {},
    alias,
    extensionApi,
    entrypointLoader: mergedConfig.entrypointLoader ?? 'vite-node',
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

  // Merge transformManifest option
  const transformManifest: InlineConfig['transformManifest'] = (manifest) => {
    userConfig.transformManifest?.(manifest);
    inlineConfig.transformManifest?.(manifest);
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
    transformManifest,
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
  extensionApi: ResolvedConfig['extensionApi'],
  config: InlineConfig,
): Promise<WxtResolvedUnimportOptions | false> {
  if (config.imports === false) return false;

  const defaultOptions: WxtResolvedUnimportOptions = {
    debugLog: logger.debug,
    imports: [
      { name: 'defineConfig', from: 'wxt' },
      { name: 'fakeBrowser', from: 'wxt/testing' },
    ],
    presets: [
      {
        package: 'wxt/client',
        // There seems to be a bug in unimport that thinks "options" is an
        // export from wxt/client, but it doesn't actually exist... so it's
        // ignored.
        ignore: ['options'],
      },
      {
        package:
          extensionApi === 'chrome' ? 'wxt/browser/chrome' : 'wxt/browser',
      },
      { package: 'wxt/sandbox' },
      { package: 'wxt/storage' },
    ],
    warn: logger.warn,
    dirs: ['components', 'composables', 'hooks', 'utils'],
    dirsScanOptions: {
      cwd: srcDir,
    },
    eslintrc: await getUnimportEslintOptions(wxtDir, config.imports?.eslintrc),
  };

  return defu<WxtResolvedUnimportOptions, [WxtResolvedUnimportOptions]>(
    config.imports ?? {},
    defaultOptions,
  );
}

async function getUnimportEslintOptions(
  wxtDir: string,
  options: Eslintrc | undefined,
): Promise<ResolvedEslintrc> {
  const rawEslintEnabled = options?.enabled ?? 'auto';
  let eslintEnabled: ResolvedEslintrc['enabled'];
  switch (rawEslintEnabled) {
    case 'auto':
      const version = await getEslintVersion();
      let major = parseInt(version[0]);
      if (isNaN(major)) eslintEnabled = false;
      if (major <= 8) eslintEnabled = 8;
      else if (major >= 9) eslintEnabled = 9;
      // NaN
      else eslintEnabled = false;
      break;
    case true:
      eslintEnabled = 8;
      break;
    default:
      eslintEnabled = rawEslintEnabled;
  }

  return {
    enabled: eslintEnabled,
    filePath: path.resolve(
      wxtDir,
      eslintEnabled === 9
        ? 'eslint-auto-imports.mjs'
        : 'eslintrc-auto-import.json',
    ),
    globalsPropValue: true,
  };
}

/**
 * Returns the path to `node_modules/wxt`.
 */
function resolveWxtModuleDir() {
  // TODO: Drop the __filename expression once we're fully running in ESM
  // (see https://github.com/wxt-dev/wxt/issues/277)
  const importer =
    typeof __filename === 'string'
      ? pathToFileURL(__filename).href
      : import.meta.url;

  // TODO: Switch to import.meta.resolve() once the parent argument is unflagged
  // (e.g. --experimental-import-meta-resolve) and all Node.js versions we support
  // have it.
  const url = esmResolve('wxt', importer);

  // esmResolve() returns the "wxt/dist/index.mjs" file, not the package's root
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
  root: string,
  modulesDir: string,
  modules: string[] = [],
): Promise<WxtModuleWithMetadata<any>[]> {
  const importer = pathToFileURL(path.join(root, 'index.js')).href;

  // Resolve node_modules modules
  const npmModules = await Promise.all<WxtModuleWithMetadata<any>>(
    modules.map(async (moduleId) => {
      // Resolve before importing to allow for a local WXT clone to be
      // symlinked into a project.
      const resolvedModulePath = esmResolve(moduleId, importer);
      const mod: { default: WxtModule<any> } = await import(
        /* @vite-ignore */ resolvedModulePath
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
