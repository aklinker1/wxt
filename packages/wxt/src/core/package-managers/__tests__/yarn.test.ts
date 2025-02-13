import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { yarn } from '../yarn';

describe('Yarn Package Management Utils', () => {
  describe('listDependencies (Yarn 1 / Classic)', () => {
    const cwd = path.resolve(__dirname, 'fixtures/simple-yarn-classic-project');

    it('should list direct dependencies', async () => {
      const actual = await yarn.listDependencies({ cwd });
      expect(actual).toEqual([
        { name: 'mime-db', version: '1.52.0' },
        { name: 'flatten', version: '1.0.3' },
        { name: 'mime-types', version: '2.1.35' },
      ]);
    });

    it('should list all dependencies', async () => {
      const actual = await yarn.listDependencies({ cwd, all: true });
      expect(actual).toEqual([
        { name: 'mime-db', version: '1.52.0' },
        { name: 'flatten', version: '1.0.3' },
        { name: 'mime-types', version: '2.1.35' },
      ]);
    });
  });

  describe('listDependencies (Yarn 2+ / Berry)', () => {
    const cwd = path.resolve(__dirname, 'fixtures/simple-yarn-berry-project');

    it('should list direct dependencies', async () => {
      const actual = await yarn.listDependencies({ cwd });
      expect(actual).toEqual([
        { name: 'mime-types', version: 'npm:2.1.35' },
        { name: 'flatten', version: 'npm:1.0.3' },
      ]);
    });

    it('should list all dependencies', async () => {
      const actual = await yarn.listDependencies({ cwd, all: true });
      expect(actual).toEqual([
        { name: 'mime-types', version: 'npm:2.1.35' },
        { name: 'mime-db', version: 'npm:1.52.0' },
        { name: 'flatten', version: 'npm:1.0.3' },
      ]);
    });
  });
});
