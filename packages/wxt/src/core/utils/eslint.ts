const ESLINT_PACKAGE_NAME = 'eslint';

export async function getEslintVersion(): Promise<string[]> {
  try {
    const { version } = await import(ESLINT_PACKAGE_NAME);
    return version.split('.') ?? [];
  } catch {
    // Return an empty version when there's an error importing ESLint
    return [];
  }
}
