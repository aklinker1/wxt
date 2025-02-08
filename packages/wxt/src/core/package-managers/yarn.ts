import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathExists } from 'fs-extra';
import { Dependency } from '../../types';
import { WxtPackageManagerImpl } from './types';
import { dedupeDependencies, npm } from './npm';
import spawn from 'nano-spawn';

// Yarn 1 (Classic) package manager implementation
export const yarnClassic: WxtPackageManagerImpl = {
  overridesKey: 'resolutions',
  downloadDependency(...args) {
    return npm.downloadDependency(...args);
  },
  async listDependencies(options) {
    const args = ['list', '--json'];
    if (options?.all) {
      args.push('--depth', 'Infinity');
    }
    const res = await spawn('yarn', args, { cwd: options?.cwd });
    const tree = res.stdout
      .split('\n')
      .map<JsonLine>((line) => JSON.parse(line))
      .find((line) => line.type === 'tree')?.data as JsonLineTree | undefined;
    if (tree == null) throw Error("'yarn list --json' did not output a tree");

    const queue = [...tree.trees];
    const dependencies: Dependency[] = [];

    while (queue.length > 0) {
      const { name: treeName, children } = queue.pop()!;
      const match = /(@?\S+)@(\S+)$/.exec(treeName);
      if (match) {
        const [_, name, version] = match;
        dependencies.push({ name, version });
      }
      if (children != null) {
        queue.push(...children);
      }
    }

    return dedupeDependencies(dependencies);
  },
};

// Returns the absolute path of the root directory of a Yarn Berry mono-repository
const getMonorepoRootDir = async () => {
  let monorepoRootDir = dirname(fileURLToPath(import.meta.url));
  while (!(await pathExists(resolve(monorepoRootDir, 'yarn.lock'))) && monorepoRootDir !== '/') {
    monorepoRootDir = dirname(monorepoRootDir);
  }
  return monorepoRootDir;
}

// yarn 2+ (Berry) package manager implementation
export const yarnBerry: WxtPackageManagerImpl = {
  overridesKey: 'resolutions',
  async downloadDependency(id: string, downloadDir: string) {
    const { execa } = await import('execa');
    if (!id.includes('@workspace:')) {
      return npm.downloadDependency(id.replace('@npm:', '@'), downloadDir);
    }
    const monorepoRootDir = await getMonorepoRootDir();
    const [dependencyName, dependencyDirRelativeToMonorepoRootDir] = id.split('@workspace:');
    const dependencyDir = resolve(monorepoRootDir, dependencyDirRelativeToMonorepoRootDir);
    const packedFilename = `${dependencyName.replace('@', '').replace('/', '-')}.tgz`;
    const archivePath = resolve(downloadDir, packedFilename);
    await execa('yarn', ['pack', '--out', archivePath], {
      cwd: dependencyDir
    });
    return archivePath;
  },
  async listDependencies(options) {
    const monorepoRootDir = await getMonorepoRootDir();
    let currentWorkspace = '.';
    if (monorepoRootDir !== '/' && options?.cwd?.startsWith(monorepoRootDir)) {
      currentWorkspace = options.cwd.substring(monorepoRootDir.length);
    }

    const args = ['info', '--name-only', '--json'];
    if (options?.all) {
      args.push('--all');
      args.push('--recursive');
    }
    const { execa } = await import('execa');
    const res = await execa('yarn', args, { cwd: options?.cwd });
    const lines = res.stdout.split('\n').map((line) => JSON.parse(line));

    const dependencies: Dependency[] = [];

    while (lines.length > 0) {
      const line = lines.pop();
      // example output formats
      // - "foo@npm:0.0.1"
      // - "@acme/foo@npm:1.2.3"
      // - "@acme/bar@workspace:packages/bar"
      // - "typescript@patch:typescript@npm%3A5.6.2#optional!builtin<compat/typescript>::version=5.6.2&hash=8c6c40"
      const name = line.substring(0, line.substring(1).indexOf('@') + 1);
      const version = line.substring(name.length + 1);
      const isCurrentPackage = version === `workspace:${currentWorkspace}`;
      if (name === '' || version === '' || isCurrentPackage) {
        continue;
      }
      dependencies.push({ name, version });
    }

    return dedupeDependencies(dependencies);
  },
};

// Yarn 1 (Classic) and Yarn 2+ (Berry) have different CLI and output formats
export const yarn: WxtPackageManagerImpl = {
  overridesKey: 'resolutions',
  async downloadDependency(id: string, downloadDir: string) {
    const { execa } = await import('execa');
    const execRes = await execa('yarn', ['--version']);
    const _yarn = execRes.stdout.startsWith('1.') ? yarnClassic : yarnBerry;
    return _yarn.downloadDependency(id, downloadDir);
  },
  async listDependencies(options) {
    const { execa } = await import('execa');
    const execRes = await execa('yarn', ['--version'], { cwd: options?.cwd });
    const _yarn = execRes.stdout.startsWith('1.') ? yarnClassic : yarnBerry;
    return _yarn.listDependencies(options);
  }
};

type JsonLine =
  | { type: unknown; data: unknown }
  | { type: 'tree'; data: JsonLineTree };

interface JsonLineTree {
  type: 'list';
  trees: Tree[];
}

interface Tree {
  name: string;
  children?: Tree[];
}
