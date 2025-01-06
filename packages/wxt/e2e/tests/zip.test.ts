import { describe, expect, it } from 'vitest';
import { TestProject } from '../utils';
import extract from 'extract-zip';
import spawn from 'nano-spawn';
import { readFile, writeFile } from 'fs-extra';

process.env.WXT_PNPM_IGNORE_WORKSPACE = 'true';

describe('Zipping', () => {
  it('should download packages and produce a valid build when zipping sources', async () => {
    const project = new TestProject({
      name: 'test',
      version: '1.0.0',
      dependencies: {
        flatten: '1.0.3',
      },
    });
    project.addFile(
      'entrypoints/background.ts',
      'export default defineBackground(() => {});',
    );
    const unzipDir = project.resolvePath('.output/test-1.0.0-sources');
    const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

    await project.zip({
      browser: 'firefox',
      zip: { downloadPackages: ['flatten'] },
    });
    expect(await project.fileExists('.output/')).toBe(true);

    await extract(sourcesZip, { dir: unzipDir });
    // Update package json wxt path
    const packageJsonPath = project.resolvePath(unzipDir, 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
    packageJson.dependencies.wxt = '../../../../..';
    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf-8',
    );

    // Build zipped extension
    await expect(
      spawn('pnpm', ['i', '--ignore-workspace', '--frozen-lockfile', 'false'], {
        cwd: unzipDir,
      }),
    ).resolves.not.toHaveProperty('exitCode');
    await expect(
      spawn('pnpm', ['wxt', 'build', '-b', 'firefox'], {
        cwd: unzipDir,
      }),
    ).resolves.not.toHaveProperty('exitCode');

    await expect(project.fileExists(unzipDir, '.output')).resolves.toBe(true);
    expect(
      await project.serializeFile(
        project.resolvePath(unzipDir, 'package.json'),
      ),
    ).toMatchInlineSnapshot(`
      ".output/test-1.0.0-sources/package.json
      ----------------------------------------
      {
        "name": "test",
        "description": "Example description",
        "version": "1.0.0",
        "type": "module",
        "dependencies": {
          "wxt": "../../../../..",
          "flatten": "1.0.3"
        },
        "resolutions": {
          "flatten@1.0.3": "file://./.wxt/local_modules/flatten-1.0.3.tgz"
        }
      }"
    `);
  });

  it('should correctly apply template variables for zip file names based on provided config', async () => {
    const project = new TestProject({
      name: 'test',
      version: '1.0.0',
    });
    project.addFile(
      'entrypoints/background.ts',
      'export default defineBackground(() => {});',
    );
    const artifactZip = '.output/test-1.0.0-firefox-development.zip';
    const sourcesZip = '.output/test-1.0.0-development-sources.zip';

    await project.zip({
      browser: 'firefox',
      mode: 'development',
      zip: {
        artifactTemplate: '{{name}}-{{version}}-{{browser}}-{{mode}}.zip',
        sourcesTemplate: '{{name}}-{{version}}-{{mode}}-sources.zip',
      },
    });

    expect(await project.fileExists(artifactZip)).toBe(true);
    expect(await project.fileExists(sourcesZip)).toBe(true);
  });

  it('should not zip hidden files into sources by default', async () => {
    const project = new TestProject({
      name: 'test',
      version: '1.0.0',
    });
    project.addFile(
      'entrypoints/background.ts',
      'export default defineBackground(() => {});',
    );
    project.addFile('.env');
    project.addFile('.hidden-dir/file');
    const unzipDir = project.resolvePath('.output/test-1.0.0-sources');
    const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

    await project.zip({
      browser: 'firefox',
    });
    await extract(sourcesZip, { dir: unzipDir });
    expect(await project.fileExists(unzipDir, '.env')).toBe(false);
    expect(await project.fileExists(unzipDir, '.hidden-dir/file')).toBe(false);
  });

  it('should not zip files inside hidden directories if only the directory is specified', async () => {
    const project = new TestProject({
      name: 'test',
      version: '1.0.0',
    });
    project.addFile(
      'entrypoints/background.ts',
      'export default defineBackground(() => {});',
    );
    project.addFile('.hidden-dir/file');
    project.addFile('.hidden-dir/nested/file');
    const unzipDir = project.resolvePath('.output/test-1.0.0-sources');
    const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

    await project.zip({
      browser: 'firefox',
      zip: {
        includeSources: ['.hidden-dir'],
      },
    });
    await extract(sourcesZip, { dir: unzipDir });
    expect(await project.fileExists(unzipDir, '.hidden-dir/file')).toBe(false);
    expect(await project.fileExists(unzipDir, '.hidden-dir/nested/file')).toBe(
      false,
    );
  });

  it('should allow zipping hidden files into sources when explicitly listed', async () => {
    const project = new TestProject({
      name: 'test',
      version: '1.0.0',
    });
    project.addFile(
      'entrypoints/background.ts',
      'export default defineBackground(() => {});',
    );
    project.addFile('.env');
    project.addFile('.hidden-dir/file');
    project.addFile('.hidden-dir/nested/file1');
    project.addFile('.hidden-dir/nested/file2');
    const unzipDir = project.resolvePath('.output/test-1.0.0-sources');
    const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

    await project.zip({
      browser: 'firefox',
      zip: {
        includeSources: ['.env', '.hidden-dir/file', '.hidden-dir/nested/**'],
      },
    });
    await extract(sourcesZip, { dir: unzipDir });
    expect(await project.fileExists(unzipDir, '.env')).toBe(true);
    expect(await project.fileExists(unzipDir, '.hidden-dir/file')).toBe(true);
    expect(await project.fileExists(unzipDir, '.hidden-dir/nested/file1')).toBe(
      true,
    );
    expect(await project.fileExists(unzipDir, '.hidden-dir/nested/file2')).toBe(
      true,
    );
  });

  it('should exclude skipped entrypoints from respective browser sources zip', async () => {
    const project = new TestProject({
      name: 'test',
      version: '1.0.0',
    });
    project.addFile(
      'entrypoints/not-firefox.content.ts',
      `export default defineContentScript({
        matches: ['*://*/*'],
        exclude: ['firefox'],
        main() {},
      });`,
    );
    project.addFile(
      'entrypoints/all.content.ts',
      `export default defineContentScript({
        matches: ['*://*/*'],
        main(ctx) {},
      });
`,
    );
    const unzipDir = project.resolvePath('.output/test-1.0.0-sources');
    const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

    await project.zip({
      browser: 'firefox',
    });
    await extract(sourcesZip, { dir: unzipDir });
    expect(
      await project.fileExists(unzipDir, 'entrypoints/not-firefox.content.ts'),
    ).toBe(false);
    expect(
      await project.fileExists(unzipDir, 'entrypoints/all.content.ts'),
    ).toBe(true);
  });

  it.each(['firefox', 'opera'])(
    'should create sources zip for "%s" browser when sourcesZip is undefined',
    async (browser) => {
      const project = new TestProject({
        name: 'test',
        version: '1.0.0',
      });
      project.addFile(
        'entrypoints/background.ts',
        'export default defineBackground(() => {});',
      );
      const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

      await project.zip({
        browser,
      });

      expect(await project.fileExists(sourcesZip)).toBe(true);
    },
  );

  it.each(['firefox', 'chrome'])(
    'should create sources zip for "%s" when sourcesZip is true',
    async (browser) => {
      const project = new TestProject({
        name: 'test',
        version: '1.0.0',
      });
      project.addFile(
        'entrypoints/background.ts',
        'export default defineBackground(() => {});',
      );
      const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

      await project.zip({
        browser,
        zip: {
          zipSources: true,
        },
      });

      expect(await project.fileExists(sourcesZip)).toBe(true);
    },
  );

  it.each(['firefox', 'chrome'])(
    'should not create sources zip for "%s" when sourcesZip is false',
    async (browser) => {
      const project = new TestProject({
        name: 'test',
        version: '1.0.0',
      });
      project.addFile(
        'entrypoints/background.ts',
        'export default defineBackground(() => {});',
      );
      const sourcesZip = project.resolvePath('.output/test-1.0.0-sources.zip');

      await project.zip({
        browser,
        zip: {
          zipSources: false,
        },
      });

      expect(await project.fileExists(sourcesZip)).toBe(false);
    },
  );
});
