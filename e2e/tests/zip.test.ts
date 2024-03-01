import { describe, expect, it } from 'vitest';
import { TestProject } from '../utils';
import extract from 'extract-zip';
import { execaCommand } from 'execa';

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

    await project.zip({ browser: 'firefox' });
    expect(await project.fileExists('.output/')).toBe(true);

    await extract(sourcesZip, { dir: unzipDir });
    await execaCommand('pnpm  --ignore-workspace i');
    const res = await execaCommand('pnpm  --ignore-workspace build');
    expect(res.exitCode).toBe(0);
  });
});
