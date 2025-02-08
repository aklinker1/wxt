import { InlineConfig } from '../types';
import path from 'node:path';
import fs from 'fs-extra';
import { safeFilename } from './utils/strings';
import { getPackageJson } from './utils/package';
import { minimatch } from 'minimatch';
import { formatDuration } from './utils/time';
import { printFileList } from './utils/log/printFileList';
import { findEntrypoints, internalBuild } from './utils/building';
import { registerWxt, wxt } from './wxt';
import JSZip from 'jszip';
import glob from 'fast-glob';
import { normalizePath } from './utils/paths';

/**
 * Build and zip the extension for distribution.
 * @param config Optional config that will override your `<root>/wxt.config.ts`.
 * @returns A list of all files included in the ZIP.
 */
export async function zip(config?: InlineConfig): Promise<string[]> {
  await registerWxt('build', config);
  const output = await internalBuild();
  await wxt.hooks.callHook('zip:start', wxt);

  const start = Date.now();
  wxt.logger.info('Zipping extension...');
  const zipFiles: string[] = [];

  const projectName =
    wxt.config.zip.name ??
    safeFilename(
      (await getPackageJson())?.name || path.basename(process.cwd()),
    );
  const applyTemplate = (template: string): string =>
    template
      .replaceAll('{{name}}', projectName)
      .replaceAll('{{browser}}', wxt.config.browser)
      .replaceAll(
        '{{version}}',
        output.manifest.version_name ?? output.manifest.version,
      )
      .replaceAll('{{mode}}', wxt.config.mode)
      .replaceAll('{{manifestVersion}}', `mv${wxt.config.manifestVersion}`);

  await fs.ensureDir(wxt.config.outBaseDir);

  // ZIP output directory
  await wxt.hooks.callHook('zip:extension:start', wxt);
  const outZipFilename = applyTemplate(wxt.config.zip.artifactTemplate);
  const outZipPath = path.resolve(wxt.config.outBaseDir, outZipFilename);
  await zipDir(wxt.config.outDir, outZipPath, {
    exclude: wxt.config.zip.exclude,
  });
  zipFiles.push(outZipPath);
  await wxt.hooks.callHook('zip:extension:done', wxt, outZipPath);

  if (wxt.config.zip.zipSources) {
    const entrypoints = await findEntrypoints();
    const skippedEntrypoints = entrypoints.filter((entry) => entry.skipped);
    const excludeSources = [
      ...wxt.config.zip.excludeSources,
      ...skippedEntrypoints.map((entry) =>
        path.relative(wxt.config.zip.sourcesRoot, entry.inputPath),
      ),
    ].map((paths) => paths.replaceAll('\\', '/'));
    await wxt.hooks.callHook('zip:sources:start', wxt);
    const { overrides, files: downloadedPackages } =
      await downloadPrivatePackages();
    const sourcesZipFilename = applyTemplate(wxt.config.zip.sourcesTemplate);
    const sourcesZipPath = path.resolve(
      wxt.config.outBaseDir,
      sourcesZipFilename,
    );
    await zipDir(wxt.config.zip.sourcesRoot, sourcesZipPath, {
      include: wxt.config.zip.includeSources,
      exclude: excludeSources,
      transform(absolutePath, zipPath, content) {
        if (zipPath.endsWith('package.json')) {
          return addOverridesToPackageJson(absolutePath, content, overrides);
        }
      },
      additionalFiles: downloadedPackages,
    });
    zipFiles.push(sourcesZipPath);
    await wxt.hooks.callHook('zip:sources:done', wxt, sourcesZipPath);
  }

  await printFileList(
    wxt.logger.success,
    `Zipped extension in ${formatDuration(Date.now() - start)}`,
    wxt.config.outBaseDir,
    zipFiles,
  );

  await wxt.hooks.callHook('zip:done', wxt, zipFiles);

  return zipFiles;
}

async function zipDir(
  directory: string,
  outputPath: string,
  options?: {
    include?: string[];
    exclude?: string[];
    transform?: (
      absolutePath: string,
      zipPath: string,
      content: string,
    ) => Promise<string | undefined | void> | string | undefined | void;
    additionalWork?: (archive: JSZip) => Promise<void> | void;
    additionalFiles?: string[];
  },
): Promise<void> {
  const archive = new JSZip();
  const files = (
    await glob(['**/*', ...(options?.include || [])], {
      cwd: directory,
      // Ignore node_modules, otherwise this glob step takes forever
      ignore: ['**/node_modules'],
      onlyFiles: true,
    })
  ).filter((relativePath) => {
    return (
      options?.include?.some((pattern) => minimatch(relativePath, pattern)) ||
      !options?.exclude?.some((pattern) => minimatch(relativePath, pattern))
    );
  });
  const filesToZip = [
    ...files,
    ...(options?.additionalFiles ?? []).map((file) =>
      path.relative(directory, file),
    ),
  ];
  for (const file of filesToZip) {
    const absolutePath = path.resolve(directory, file);
    if (file.endsWith('.json')) {
      const content = await fs.readFile(absolutePath, 'utf-8');
      archive.file(
        file,
        (await options?.transform?.(absolutePath, file, content)) || content,
      );
    } else {
      const content = await fs.readFile(absolutePath);
      archive.file(file, content);
    }
  }
  await options?.additionalWork?.(archive);

  await new Promise<void>((resolve, reject) =>
    archive
      .generateNodeStream({
        type: 'nodebuffer',
        ...(wxt.config.zip.compressionLevel === 0
          ? { compression: 'STORE' }
          : {
              compression: 'DEFLATE',
              compressionOptions: { level: wxt.config.zip.compressionLevel },
            }),
      })
      .pipe(fs.createWriteStream(outputPath))
      .on('error', reject)
      .on('close', resolve),
  );
}

async function downloadPrivatePackages() {
  const overrides: Record<string, string> = {};
  const files: string[] = [];

  if (wxt.config.zip.downloadPackages.length > 0) {
    const _downloadPackages = new Set(wxt.config.zip.downloadPackages);
    const allPackages = await wxt.pm.listDependencies({
      all: true,
      cwd: wxt.config.root,
    });
    const downloadPackages = allPackages.filter((pkg) =>
      _downloadPackages.has(pkg.name),
    );

    for (const pkg of downloadPackages) {
      const protocol = pkg.version.split(':')[0];
      const isDownloadable = !['file', 'patch'].includes(protocol);

      if (!isDownloadable) {
        wxt.logger.warn(
          `Skipping package download: ${pkg.name}@${pkg.version}`,
        );
        continue;
      }

      wxt.logger.info(`Downloading package: ${pkg.name}@${pkg.version}`);
      const id = `${pkg.name}@${pkg.version}`;
      const tgzPath = await wxt.pm.downloadDependency(
        id,
        wxt.config.zip.downloadedPackagesDir,
      );
      files.push(tgzPath);

      // removes version strings that may cause issues with Yarn Berry
      const overrideKey = id.replace(/@(npm|workspace):.*$/, '');
      overrides[overrideKey] = tgzPath;
    }
  }

  return { overrides, files };
}

function addOverridesToPackageJson(
  absolutePackageJsonPath: string,
  content: string,
  overrides: Record<string, string>,
): string {
  if (Object.keys(overrides).length === 0) return content;

  const packageJsonDir = path.dirname(absolutePackageJsonPath);
  const oldPackage = JSON.parse(content);
  const newPackage = {
    ...oldPackage,
    [wxt.pm.overridesKey]: { ...oldPackage[wxt.pm.overridesKey] },
  };
  Object.entries(overrides).forEach(([key, absolutePath]) => {
    newPackage[wxt.pm.overridesKey][key] =
      'file:./' + normalizePath(path.relative(packageJsonDir, absolutePath));
  });
  return JSON.stringify(newPackage, null, 2);
}
