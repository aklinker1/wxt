import { dirname, relative, resolve } from 'path';
import fs, { mkdir } from 'fs-extra';
import glob from 'fast-glob';
import spawn from 'nano-spawn';
import {
  InlineConfig,
  UserConfig,
  build,
  createServer,
  prepare,
  zip,
} from '../src';
import { normalizePath } from '../src/core/utils/paths';
import merge from 'lodash.merge';

// Run "pnpm wxt" to use the "wxt" dev script, not the "wxt" binary from the
// wxt package. This uses the TS files instead of the compiled JS package
// files.
export const WXT_PACKAGE_DIR = resolve(__dirname, '..');

export const E2E_DIR = resolve(WXT_PACKAGE_DIR, 'e2e');

export class TestProject {
  files: Array<[string, string]> = [];
  config: UserConfig | undefined;
  readonly root: string;

  constructor(packageJson: any = {}) {
    // We can't put each test's project inside e2e/dist directly, otherwise the wxt.config.ts
    // file is cached and cannot be different between each test. Instead, we add a random ID to the
    // end to make each test's path unique.
    const id = Math.random().toString(32).substring(3);
    this.root = resolve(E2E_DIR, 'dist', id);
    this.files.push([
      'package.json',
      JSON.stringify(
        merge(
          {
            name: 'E2E Extension',
            description: 'Example description',
            version: '0.0.0',
            type: 'module',
            dependencies: {
              wxt: '../../..',
            },
          },
          packageJson,
        ),
        null,
        2,
      ),
    ]);
  }

  /**
   * Add a `wxt.config.ts` to the project with specific contents.
   */
  setConfigFileConfig(config: UserConfig = {}) {
    this.config = config;
    this.files.push([
      'wxt.config.ts',
      `import { defineConfig } from 'wxt'\n\nexport default defineConfig(${JSON.stringify(
        config,
        null,
        2,
      )})`,
    ]);
  }

  /**
   * Adds the file to the project. Stored in memory until `.build` is called.
   *
   * @param filename Filename relative to the project's root.
   * @param content File content.
   * @returns The absolute path to the file that was added.
   */
  addFile(filename: string, content?: string) {
    this.files.push([filename, content ?? '']);
    if (filename === 'wxt.config.ts') this.config = {};
    return this.resolvePath(filename);
  }

  async prepare(config: InlineConfig = {}) {
    await this.writeProjectToDisk();
    await prepare({ ...config, root: this.root });
  }

  async build(config: InlineConfig = {}) {
    await this.writeProjectToDisk();
    return await build({ ...config, root: this.root });
  }

  async zip(config: InlineConfig = {}) {
    await this.writeProjectToDisk();
    await zip({ ...config, root: this.root });
  }

  async startServer(config: InlineConfig = {}) {
    await this.writeProjectToDisk();
    const server = await createServer({ ...config, root: this.root });
    await server.start();
    return server;
  }

  /**
   * Call `path.resolve` relative to the project's root directory.
   */
  resolvePath(...path: string[]): string {
    return resolve(this.root, ...path);
  }

  private async writeProjectToDisk() {
    if (this.config == null) this.setConfigFileConfig();

    for (const file of this.files) {
      const [name, content] = file;
      const filePath = this.resolvePath(name);
      const fileDir = dirname(filePath);
      await fs.ensureDir(fileDir);
      await fs.writeFile(filePath, content ?? '', 'utf-8');
    }

    await spawn('pnpm', ['--ignore-workspace', 'i', '--ignore-scripts'], {
      cwd: this.root,
    });
    await mkdir(resolve(this.root, 'public'), { recursive: true }).catch(
      () => {},
    );
  }

  /**
   * Read all the files from the test project's `.output` directory and combine them into a string
   * that can be used in a snapshot.
   *
   * Optionally, provide a list of filenames whose content is not printed (because it's inconsistent
   * or not relevant to a test).
   */
  serializeOutput(ignoreContentsOfFilenames?: string[]): Promise<string> {
    return this.serializeDir('.output', ignoreContentsOfFilenames);
  }

  /**
   * Read all the files from the test project's `.wxt` directory and combine them into a string
   * that can be used in a snapshot.
   */
  serializeWxtDir(): Promise<string> {
    return this.serializeDir(resolve(this.root, '.wxt/types'));
  }

  /**
   * Deeply print the filename and contents of all files in a directory.
   *
   * Optionally, provide a list of filenames whose content is not printed (because it's inconsistent
   * or not relevant to a test).
   */
  private async serializeDir(
    dir: string,
    ignoreContentsOfFilenames?: string[],
  ): Promise<string> {
    const outputFiles = await glob('**/*', {
      cwd: this.resolvePath(dir),
      ignore: ['**/node_modules', '**/.output'],
    });
    outputFiles.sort();
    const fileContents = [];
    for (const file of outputFiles) {
      const path = this.resolvePath(dir, file);
      const isContentIgnored = !!ignoreContentsOfFilenames?.find(
        (ignoredFile) => normalizePath(path).endsWith(ignoredFile),
      );
      fileContents.push(await this.serializeFile(path, isContentIgnored));
    }
    return fileContents.join(`\n${''.padEnd(80, '=')}\n`);
  }

  /**
   * @param path An absolute path to a file or a path relative to the root.
   * @param ignoreContents An optional boolean that, when true, causes this function to not print
   *                       the file contents.
   */
  async serializeFile(path: string, ignoreContents?: boolean): Promise<string> {
    const absolutePath = this.resolvePath(path);
    return [
      normalizePath(relative(this.root, absolutePath)),
      ignoreContents ? '<contents-ignored>' : await fs.readFile(absolutePath),
    ].join(`\n${''.padEnd(40, '-')}\n`);
  }

  fileExists(...path: string[]): Promise<boolean> {
    return fs.exists(this.resolvePath(...path));
  }

  async getOutputManifest(
    path: string = '.output/chrome-mv3/manifest.json',
  ): Promise<any> {
    return await fs.readJson(this.resolvePath(path));
  }
}
