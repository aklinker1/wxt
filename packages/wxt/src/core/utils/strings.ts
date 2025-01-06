import { camelCase } from 'scule';

export function kebabCaseAlphanumeric(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, '') // Remove all non-alphanumeric, non-hyphen characters
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * Return a safe variable name for a given string.
 */
export function safeVarName(str: string): string {
  const name = camelCase(kebabCaseAlphanumeric(str));
  if (name.match(/^[a-z]/)) return name;
  // _ prefix to ensure it doesn't start with a number or other invalid symbol
  return '_' + name;
}

/**
 * Converts a string to a valid filename (NOT path), stripping out invalid characters.
 */
export function safeFilename(str: string): string {
  return kebabCaseAlphanumeric(str);
}

/**
 * Removes import statements from the top of a file. Keeps import.meta and inline, async `import()`
 * calls.
 */
export function removeImportStatements(text: string): string {
  return text.replace(
    /(import\s?[\s\S]*?from\s?["'][\s\S]*?["'];?|import\s?["'][\s\S]*?["'];?)/gm,
    '',
  );
}
