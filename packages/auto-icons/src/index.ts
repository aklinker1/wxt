import 'wxt';
import { defineWxtModule } from 'wxt/modules';
import { resolve } from 'node:path';
import defu from 'defu';
import sharp from 'sharp';
import { ensureDir } from 'fs-extra';
import glob from 'fast-glob';

const extensionNames = [
  'png',
  'svg',
  'webp',
  'jpg',
  'jpeg',
  'jpe',
  'jfif',
  'tif',
  'heif',
  'heic',
  'avif',
  'tiff',
  'ico',
  'bmp',
];

export default defineWxtModule<AutoIconsOptions>({
  name: '@wxt-dev/auto-icons',
  configKey: 'autoIcons',
  async setup(wxt, options) {
    const parsedOptions = defu<Required<AutoIconsOptions>, AutoIconsOptions[]>(
      options,
      {
        enabled: true,
        baseIconPath: '{assets,public}',
        grayscaleOnDevelopment: true,
        sizes: [128, 48, 32, 16],
        iconName: 'icon',
      },
    );

    if (!parsedOptions.enabled)
      return wxt.logger.warn(`\`[auto-icons]\` ${this.name} disabled`);

    // Create glob pattern based on iconName and extensionNames
    const iconGlobPattern = `${parsedOptions.baseIconPath}/${parsedOptions.iconName}.{${extensionNames.join(',')}}`;

    // Find matching icon files
    const iconFiles = await glob(iconGlobPattern, {
      cwd: wxt.config.srcDir,
      absolute: true,
    });

    if (iconFiles.length === 0) {
      return wxt.logger.warn(
        `\`[auto-icons]\` Skipping icon generation, no base icon found matching ${iconGlobPattern}`,
      );
    }

    // Use the first matching icon file
    const resolvedPath = iconFiles[0];

    wxt.hooks.hook('build:manifestGenerated', async (wxt, manifest) => {
      if (manifest.icons)
        return wxt.logger.warn(
          '`[auto-icons]` icons property found in manifest, overwriting with auto-generated icons',
        );

      manifest.icons = Object.fromEntries(
        parsedOptions.sizes.map((size) => [size, `icons/${size}.png`]),
      );
    });

    wxt.hooks.hook('build:done', async (wxt, output) => {
      const image = sharp(resolvedPath).toFormat('png').png();

      if (
        wxt.config.mode === 'development' &&
        parsedOptions.grayscaleOnDevelopment
      ) {
        image.grayscale();
      }

      const outputFolder = wxt.config.outDir;

      for (const size of parsedOptions.sizes) {
        const resized = image.resize(size);
        ensureDir(resolve(outputFolder, 'icons'));
        await resized.toFile(resolve(outputFolder, `icons/${size}.png`));

        output.publicAssets.push({
          type: 'asset',
          fileName: `icons/${size}.png`,
        });
      }
    });

    wxt.hooks.hook('prepare:publicPaths', (wxt, paths) => {
      for (const size of parsedOptions.sizes) {
        paths.push(`icons/${size}.png`);
      }
    });
  },
});

/**
 * Options for the auto-icons module
 */
export interface AutoIconsOptions {
  /**
   * Enable auto-icons generation
   * @default true
   */
  enabled?: boolean;
  /**
   * Base path for icon search.
   *
   * Path is relative to the project's src directory.
   * @default "{assets,public}"
   */
  baseIconPath?: string;
  /**
   * Grayscale the image when in development mode to indicate development
   * @default true
   */
  grayscaleOnDevelopment?: boolean;
  /**
   * Sizes to generate icons for
   * @default [128, 48, 32, 16]
   */
  sizes?: number[];
  /**
   * Name of the icon file to use
   * @default "icon"
   */
  iconName?: string;
}

declare module 'wxt' {
  export interface InlineConfig {
    autoIcons?: AutoIconsOptions;
  }
}
