import { ProxifiedModule, parseModule } from 'magicast';

/**
 * Removes any code used at runtime related to an entrypoint's main function.
 * 1. Removes or clears out `main` function from returned object
 * 2. Removes any unused functions/variables outside the definition that aren't being called/used
 * 3. Removes unused imports
 * 3. Removes value-less, side-effect only imports (like `import "./styles.css"` or `import "polyfill"`)
 */
export function removeMainFunctionCode(code: string): {
  code: string;
  map?: string;
} {
  const mod = parseModule(code);
  emptyMainFunction(mod);
  let removedCount = 0;
  let depth = 0;
  const maxDepth = 10;
  do {
    removedCount = 0;
    removedCount += removeUnusedTopLevelVariables(mod);
    removedCount += removeUnusedTopLevelFunctions(mod);
    removedCount += removeUnusedImports(mod);
  } while (removedCount > 0 && depth++ <= maxDepth);
  removeSideEffectImports(mod);
  return mod.generate();
}

function emptyMainFunction(mod: ProxifiedModule): void {
  if (mod.exports?.default?.$type === 'function-call') {
    if (mod.exports.default.$ast?.arguments?.[0]?.body) {
      // Remove body from function
      // ex: "fn(() => { ... })" to "fn()"
      // ex: "fn(function () { ... })" to "fn()"
      delete mod.exports.default.$ast.arguments[0];
    } else if (mod.exports.default.$ast?.arguments?.[0]?.properties) {
      // Remove main field from object
      // ex: "fn({ ..., main: () => {} })" to "fn({ ... })"
      mod.exports.default.$ast.arguments[0].properties =
        mod.exports.default.$ast.arguments[0].properties.filter(
          (prop: any) => prop.key.name !== 'main',
        );
    }
  }
}

function removeUnusedTopLevelVariables(mod: ProxifiedModule): number {
  const simpleAst = getSimpleAstJson(mod.$ast);
  const usedMap = findUsedIdentifiers(simpleAst);

  let deletedCount = 0;
  const ast = mod.$ast as any;
  for (let i = ast.body.length - 1; i >= 0; i--) {
    if (ast.body[i].type === 'VariableDeclaration') {
      for (let j = ast.body[i].declarations.length - 1; j >= 0; j--) {
        if (!usedMap.get(ast.body[i].declarations[j].id.name)) {
          ast.body[i].declarations.splice(j, 1);
          deletedCount++;
        }
      }
      if (ast.body[i].declarations.length === 0) {
        ast.body.splice(i, 1);
      }
    }
  }
  return deletedCount;
}

function removeUnusedTopLevelFunctions(mod: ProxifiedModule): number {
  const simpleAst = getSimpleAstJson(mod.$ast);
  const usedMap = findUsedIdentifiers(simpleAst);

  let deletedCount = 0;
  const ast = mod.$ast as any;
  for (let i = ast.body.length - 1; i >= 0; i--) {
    if (
      ast.body[i].type === 'FunctionDeclaration' &&
      !usedMap.get(ast.body[i].id.name)
    ) {
      ast.body.splice(i, 1);
      deletedCount++;
    }
  }
  return deletedCount;
}

function removeUnusedImports(mod: ProxifiedModule): number {
  const simpleAst = getSimpleAstJson(mod.$ast);
  const usedMap = findUsedIdentifiers(simpleAst);
  const importSymbols = Object.keys(mod.imports);

  let deletedCount = 0;
  importSymbols.forEach((name) => {
    if (usedMap.get(name)) return;

    delete mod.imports[name];
    deletedCount++;
  });
  return deletedCount;
}

// TODO: Do a more complex declaration analysis where shadowed variables are detected and ignored.
// Right now, this code assumes there are no shadowed variables.
function findUsedIdentifiers(simpleAst: any) {
  const usedMap = new Map<string, boolean>();
  const queue: any[] = [simpleAst];
  for (const item of queue) {
    if (!item) {
    } else if (Array.isArray(item)) {
      queue.push(...item);
    } else if (item.type === 'ImportDeclaration') {
      // Don't look inside imports, identifiers are only used for declaration
      continue;
    } else if (item.type === 'Identifier') {
      usedMap.set(item.name, true);
    } else if (typeof item === 'object') {
      const filterFns: Record<string, (entry: [string, any]) => boolean> = {
        // Ignore the function declaration's name
        FunctionDeclaration: ([key]) => key !== 'id',
        // Ignore object property names
        ObjectProperty: ([key]) => key !== 'key',
        // Ignore variable declaration's name
        VariableDeclarator: ([key]) => key !== 'id',
      };
      queue.push(
        Object.entries(item)
          .filter(filterFns[item.type] ?? (() => true))
          .map(([_, value]) => value),
      );
    }
  }
  return usedMap;
}

function deleteImportAst(
  mod: ProxifiedModule,
  shouldDelete: (node: any) => boolean,
): void {
  const importIndexesToDelete: number[] = [];
  (mod.$ast as any).body.forEach((node: any, index: number) => {
    if (node.type === 'ImportDeclaration' && shouldDelete(node)) {
      importIndexesToDelete.push(index);
    }
  });
  importIndexesToDelete.reverse().forEach((i) => {
    delete (mod.$ast as any).body[i];
  });
}

function removeSideEffectImports(mod: ProxifiedModule): void {
  deleteImportAst(mod, (node) => node.specifiers.length === 0);
}

/**
 * Util to get the AST as a simple JSON object, stripping out large objects and file locations to keep it readible
 */
function getSimpleAstJson(ast: any): any {
  if (!ast) {
    return ast;
  } else if (Array.isArray(ast)) {
    return ast.map(getSimpleAstJson);
  } else if (typeof ast === 'object') {
    return Object.fromEntries(
      Object.entries(ast)
        .filter(([key]) => key !== 'loc' && key !== 'start' && key !== 'end')
        .map(([key, value]) => [key, getSimpleAstJson(value)]),
    );
  } else {
    return ast;
  }
}
