import { resolve } from 'node:path';
import { Project, ts, Type, Node, JSDocableNode } from 'ts-morph';
import Ora from 'ora';
import { readFileSync, writeFileSync } from 'node:fs';

const externalTypesPath = resolve('src/core/types/external.ts');
const configTemplatePath = resolve('docs/config.tpl.md');
const configPath = resolve('docs/config.md');

/**
 * Custom property paths that should not be recursively inspected. Usually 3rd party types.
 */
const LEAF_PATHS = ['imports', 'vite', 'server'];

/**
 * Override any types that resolve to `import(...)` instead of their type names when calling
 * `type.getText()`
 */
const CUSTOM_TYPES = {
  manifest:
    'Manifest | Promise<Manifest> | () => Manifest | () => Promise<Manifest>',
};

export function generateConfigDocs() {
  const generateDocs = () => {
    const spinner = Ora('Generating /config.md').start();
    try {
      const project = new Project({
        tsConfigFilePath: resolve('tsconfig.json'),
      });

      // Load file containing "UserConfig"
      const externalTypesFile = project.addSourceFileAtPath(externalTypesPath);
      project.resolveSourceFileDependencies();

      const typeChecker = project.getProgram().getTypeChecker();

      const inlineConfigInterface =
        externalTypesFile.getInterfaceOrThrow('InlineConfig');

      const getDocsFor = (
        path: string[],
        node: Node<ts.Node>,
        depth = 0,
      ): string[] => {
        if (depth > 3) throw Error('Recursion to deep for ' + path.join('.'));

        const pathStr = path.join('.');

        let type: Type<ts.Type>;
        if (node.isKind(ts.SyntaxKind.InterfaceDeclaration)) {
          type = node.getType();
        } else if (node.isKind(ts.SyntaxKind.PropertySignature)) {
          type = node.getTypeNodeOrThrow()?.getType();
        } else if (node.isKind(ts.SyntaxKind.MethodSignature)) {
          type = node.getType();
        } else {
          throw Error('Unsupported type node: ' + node.getKindName());
        }

        if (type.isObject() && !type.isArray()) {
          return (
            type
              .getProperties()
              // .sort((l, r) => l.getName().localeCompare(r.getName()))
              .flatMap((property) => {
                const childPath = [...path, property.getName()];
                if (LEAF_PATHS.includes(childPath.join('.'))) return [];

                return getDocsFor(
                  childPath,
                  property.getDeclarations()[0],
                  depth + 1,
                );
              })
          );
        }

        if ('getJsDocs' in node) {
          const lines: string[] = [];
          const docs = (node as unknown as JSDocableNode).getJsDocs();
          let typeText: string;
          if (CUSTOM_TYPES[pathStr]) {
            typeText = CUSTOM_TYPES[pathStr];
          } else if (type.isUnion() && !type.isBoolean()) {
            typeText = type
              .getUnionTypes()
              .map((type) => type.getText())
              .join(' | ');
          } else {
            typeText = type.getText();
          }
          const defaultValue = docs
            .flatMap((doc) => doc.getTags())
            .find((tag) => tag.getTagName() === 'default')
            ?.getCommentText();
          lines.push(
            '',
            `## ${pathStr}`,
            '',
            `- **Type**: \`${typeText}\``,
            `- **Default**: \`${defaultValue}\``,
            ...docs.flatMap((doc) => doc.getDescription()),
          );
          return lines;
        }

        return [];
      };

      const lines = getDocsFor([], inlineConfigInterface);
      const text = readFileSync(configTemplatePath, 'utf-8').replace(
        '{{ DOCS }}',
        lines.join('\n'),
      );

      writeFileSync(configPath, text);
      spinner.succeed('Generated /config.md');
    } catch (err) {
      spinner.fail('Failed to generate /config.md');
      console.error(err.message);
    }
  };

  return {
    name: 'docs:generate-config-docs',
    buildStart() {
      generateDocs();
    },
    configureServer(server: any) {
      server.watcher.add(externalTypesPath);
    },
    handleHotUpdate(ctx: { file: string }) {
      if ([externalTypesPath, configTemplatePath].includes(ctx.file)) {
        generateDocs();
      }
    },
  };
}
