import { BuildOutput, Entrypoint, EntrypointGroup } from '../../../types';
import { generateWxtDir } from '../../generate-wxt-dir';
import { buildEntrypoints } from './build-entrypoints';
import { generateManifest, writeManifest } from '../../utils/manifest';
import { wxt } from '../../wxt';

/**
 * Given a configuration, list of entrypoints, and an existing, partial output, build the
 * entrypoints and merge the new output with the existing output.
 *
 * This function will:
 * 1. Generate the .wxt directory's types
 * 2. Build the `entrypointGroups` (and copies public files)
 * 3. Generate the latest manifest for all entrypoints
 * 4. Write the new manifest to the file system
 *
 * @param config Internal config containing all the project information.
 * @param allEntrypoints List of entrypoints used to generate the types inside .wxt directory.
 * @param entrypointGroups The list of entrypoint groups to build.
 * @param existingOutput The previous output to combine the rebuild results into. An emptry array if
 *                       this is the first build.
 */
export async function rebuild(
  allEntrypoints: Entrypoint[],
  entrypointGroups: EntrypointGroup[],
  existingOutput: Omit<BuildOutput, 'manifest'> = {
    steps: [],
    publicAssets: [],
  },
): Promise<{
  output: BuildOutput;
  manifest: chrome.runtime.Manifest;
  warnings: any[][];
}> {
  const { default: ora } = await import('ora');
  const spinner = ora(`Preparing...`).start();

  // Update types directory with new files and types
  await generateWxtDir(allEntrypoints).catch((err) => {
    wxt.logger.warn('Failed to update .wxt directory:', err);
    // Throw the error if doing a regular build, don't for dev mode.
    if (wxt.config.command === 'build') throw err;
  });

  // Build and merge the outputs
  const newOutput = await buildEntrypoints(entrypointGroups, spinner);
  const mergedOutput: Omit<BuildOutput, 'manifest'> = {
    steps: [...existingOutput.steps, ...newOutput.steps],
    // Do not merge existing because all publicAssets copied everytime
    publicAssets: newOutput.publicAssets,
  };

  const { manifest: newManifest, warnings: manifestWarnings } =
    await generateManifest(allEntrypoints, mergedOutput);

  const finalOutput: BuildOutput = {
    manifest: newManifest,
    ...mergedOutput,
  };

  // Write manifest
  await writeManifest(newManifest, finalOutput);

  // Stop the spinner and remove it from the CLI output
  spinner.clear().stop();

  return {
    output: finalOutput,
    manifest: newManifest,
    warnings: manifestWarnings,
  };
}
