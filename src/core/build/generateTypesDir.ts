import { createUnimport } from 'unimport';
import { Entrypoint, InternalConfig } from '../types';
import fs from 'fs-extra';
import { relative, resolve } from 'path';
import { getEntrypointBundlePath } from '../utils/entrypoints';
import { getUnimportOptions } from '../utils/auto-imports';
import { getGlobals } from '../utils/globals';
import { getPublicFiles } from '../utils/public';
import { normalizePath } from '../utils/paths';

/**
 * Generate and write all the files inside the `InternalConfig.typesDir` directory.
 */
export async function generateTypesDir(
  entrypoints: Entrypoint[],
  config: InternalConfig,
): Promise<void> {
  await fs.ensureDir(config.typesDir);

  const references: string[] = [];
  references.push(await writeImportsDeclarationFile(config));
  references.push(await writePathsDeclarationFile(entrypoints, config));
  references.push(await writeGlobalsDeclarationFile(config));

  const mainReference = await writeMainDeclarationFile(references, config);
  await writeTsConfigFile(mainReference, config);
}

async function writeImportsDeclarationFile(
  config: InternalConfig,
): Promise<string> {
  const filePath = resolve(config.typesDir, 'imports.d.ts');
  const unimport = createUnimport(getUnimportOptions(config));

  // Load project imports into unimport memory so they are output via generateTypeDeclarations
  await unimport.scanImportsFromDir(undefined, { cwd: config.srcDir });

  await fs.writeFile(
    filePath,
    ['// Generated by wxt', await unimport.generateTypeDeclarations()].join(
      '\n',
    ) + '\n',
  );

  return filePath;
}

async function writePathsDeclarationFile(
  entrypoints: Entrypoint[],
  config: InternalConfig,
): Promise<string> {
  const filePath = resolve(config.typesDir, 'paths.d.ts');
  const unions = entrypoints
    .map((entry) =>
      getEntrypointBundlePath(
        entry,
        config.outDir,
        entry.inputPath.endsWith('.html') ? '.html' : '.js',
      ),
    )
    .concat(await getPublicFiles(config))
    .map(normalizePath)
    .map((path) => `    | "/${path}"`)
    .sort()
    .join('\n');

  const template = `// Generated by wxt
import "wxt/browser";

declare module "wxt/browser" {
  type PublicPath =
{{ union }}
  export interface ProjectRuntime extends Runtime.Static {
    getURL(path: PublicPath): string;
  }
}
`;

  await fs.writeFile(
    filePath,
    template.replace('{{ union }}', unions || '    | never'),
  );

  return filePath;
}

async function writeGlobalsDeclarationFile(
  config: InternalConfig,
): Promise<string> {
  const filePath = resolve(config.typesDir, 'globals.d.ts');
  const globals = getGlobals(config);
  await fs.writeFile(
    filePath,
    [
      '// Generated by wxt',
      'export {}',
      'declare global {',
      ...globals.map((global) => `  const ${global.name}: ${global.type};`),
      '}',
    ].join('\n') + '\n',
    'utf-8',
  );
  return filePath;
}

async function writeMainDeclarationFile(
  references: string[],
  config: InternalConfig,
): Promise<string> {
  const dir = config.wxtDir;
  const filePath = resolve(dir, 'wxt.d.ts');
  await fs.writeFile(
    filePath,
    [
      '// Generated by wxt',
      `/// <reference types="vite/client" />`,
      ...references.map(
        (ref) =>
          `/// <reference types="./${normalizePath(relative(dir, ref))}" />`,
      ),
    ].join('\n') + '\n',
  );
  return filePath;
}

async function writeTsConfigFile(
  mainReference: string,
  config: InternalConfig,
) {
  const dir = config.wxtDir;
  await fs.writeFile(
    resolve(dir, 'tsconfig.json'),
    `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "strict": true,
    "lib": ["DOM", "WebWorker"],
    "skipLibCheck": true,
    "baseUrl": "${normalizePath(relative(dir, config.root))}",
    "paths": {
      "@@": ["."],
      "@@/*": ["./*"],
      "~~": ["."],
      "~~/*": ["./*"],
      "@": ["${normalizePath(relative(config.root, config.srcDir))}"],
      "@/*": ["${normalizePath(relative(config.root, config.srcDir))}/*"],
      "~": ["${normalizePath(relative(config.root, config.srcDir))}"],
      "~/*": ["${normalizePath(relative(config.root, config.srcDir))}/*"]
    }
  },
  "include": [
    "${normalizePath(relative(dir, config.root))}/**/*",
    "./${normalizePath(relative(dir, mainReference))}"
  ],
  "exclude": ["${normalizePath(relative(dir, config.outBaseDir))}"]
}`,
  );
}
