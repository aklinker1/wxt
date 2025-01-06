import { describe, it, expect } from 'vitest';
import { TestProject } from '../utils';

describe('User Config', () => {
  // Root directory is tested with all tests.

  it("should respect the 'src' directory", async () => {
    const project = new TestProject();
    project.setConfigFileConfig({
      srcDir: 'src',
    });
    project.addFile(
      'src/entrypoints/background.ts',
      `export default defineBackground(
        () => console.log('Hello background'),
      );`,
    );

    await project.build();

    const output = await project.serializeOutput([
      '.output/chrome-mv3/background.js',
    ]);
    expect(output).toMatchInlineSnapshot(`
      ".output/chrome-mv3/background.js
      ----------------------------------------
      <contents-ignored>
      ================================================================================
      .output/chrome-mv3/manifest.json
      ----------------------------------------
      {"manifest_version":3,"name":"E2E Extension","description":"Example description","version":"0.0.0","background":{"service_worker":"background.js"}}"
    `);
  });

  it("should respect the 'entrypoints' directory", async () => {
    const project = new TestProject();
    project.setConfigFileConfig({
      entrypointsDir: 'entries',
    });
    project.addFile(
      'entries/background.ts',
      `export default defineBackground(() => console.log('Hello background'));`,
    );

    await project.build();

    const output = await project.serializeOutput([
      '.output/chrome-mv3/background.js',
    ]);
    expect(output).toMatchInlineSnapshot(`
      ".output/chrome-mv3/background.js
      ----------------------------------------
      <contents-ignored>
      ================================================================================
      .output/chrome-mv3/manifest.json
      ----------------------------------------
      {"manifest_version":3,"name":"E2E Extension","description":"Example description","version":"0.0.0","background":{"service_worker":"background.js"}}"
    `);
  });

  it('should merge inline and user config based manifests', async () => {
    const project = new TestProject();
    project.addFile('entrypoints/unlisted.html', '<html></html>');
    project.addFile(
      'wxt.config.ts',
      `import { defineConfig } from 'wxt';
      export default defineConfig({
        manifest: ({ mode, browser }) => ({
          // @ts-expect-error
          example_customization: [mode, browser],
        })
      })`,
    );

    await project.build({
      // Specifically setting an invalid field for the test - it should show up in the snapshot
      manifest: ({ manifestVersion, command }) => ({
        example_customization: [String(manifestVersion), command],
      }),
    });

    expect(await project.serializeFile('.output/chrome-mv3/manifest.json'))
      .toMatchInlineSnapshot(`
      ".output/chrome-mv3/manifest.json
      ----------------------------------------
      {"manifest_version":3,"name":"E2E Extension","description":"Example description","version":"0.0.0","example_customization":["3","build","production","chrome"]}"
    `);
  });

  it('should respect changing config files', async () => {
    const project = new TestProject();
    project.addFile(
      'src/entrypoints/background.ts',
      `export default defineBackground(
        () => console.log('Hello background'),
      );`,
    );
    project.addFile(
      'test.config.ts',
      `import { defineConfig } from 'wxt';

      export default defineConfig({
        outDir: ".custom-output",
        srcDir: "src",
      });`,
    );

    await project.build({ configFile: 'test.config.ts' });

    expect(
      await project.fileExists('.custom-output/chrome-mv3/background.js'),
    ).toBe(true);
  });

  it('should respect outDirTemplate', async () => {
    const project = new TestProject();
    project.setConfigFileConfig({
      srcDir: 'src',
      outDirTemplate:
        'test-{{browser}}-mv{{manifestVersion}}-{{mode}}{{modeSuffix}}-{{command}}',
    });
    project.addFile(
      'src/entrypoints/background.ts',
      `export default defineBackground(
        () => console.log('Hello background'),
      );`,
    );

    await project.build();

    expect(
      await project.fileExists('.output/test-chrome-mv3-production-build'),
    ).toBe(true);

    await project.build({ mode: 'development' });

    expect(
      await project.fileExists('.output/test-chrome-mv3-development-dev-build'),
    ).toBe(true);
  });

  it('should throw error when config file not exist', async () => {
    const project = new TestProject();
    project.addFile(
      'src/entrypoints/background.ts',
      `export default defineBackground(
        () => console.log('Hello background'),
      );`,
    );

    await expect(
      project.build({ configFile: 'foo.config.ts' }),
    ).rejects.toThrowError(/not found/);
  });
});
