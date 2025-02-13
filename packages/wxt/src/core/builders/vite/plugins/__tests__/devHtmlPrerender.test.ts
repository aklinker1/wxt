import { describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { pointToDevServer } from '../devHtmlPrerender';
import {
  fakeDevServer,
  fakeResolvedConfig,
} from '../../../../utils/testing/fake-objects';
import { normalizePath } from '../../../../utils/paths';
import { resolve } from 'node:path';

describe('Dev HTML Prerender Plugin', () => {
  describe('pointToDevServer', () => {
    it.each([
      // File paths should be resolved
      ['style.css', 'http://localhost:5173/entrypoints/popup/style.css'],
      ['./style.css', 'http://localhost:5173/entrypoints/popup/style.css'],
      ['../style.css', 'http://localhost:5173/entrypoints/style.css'],
      ['~/assets/style.css', 'http://localhost:5173/assets/style.css'],
      ['~~/assets/style.css', 'http://localhost:5173/assets/style.css'],
      ['~local/style.css', 'http://localhost:5173/style.css'],
      ['~absolute/style.css', 'http://localhost:5173/assets/style.css'],
      ['~file', 'http://localhost:5173/example.css'],
      // Absolute paths are loaded with the `/@fs/` base path
      [
        '~outside/test.css',
        `http://localhost:5173/@fs${
          process.platform === 'win32'
            ? '/' + normalizePath(resolve('/some/non-root/test.css')) // "/D:/some/non-root/test.css"
            : '/some/non-root/test.css'
        }`,
      ],
      // URLs should not be changed
      ['https://example.com/style.css', 'https://example.com/style.css'],
    ])('should transform "%s" into "%s"', (input, expected) => {
      const { document } = new Window({
        url: 'http://localhost',
      });
      const root = '/some/root';
      const config = fakeResolvedConfig({
        root,
        alias: {
          '~local': '.',
          '~absolute': `${root}/assets`,
          '~file': `${root}/example.css`,
          '~outside': `${root}/../non-root`,
          '~~': root,
          '~': root,
        },
      });
      const server = fakeDevServer({
        host: 'localhost',
        port: 5173,
        origin: 'http://localhost:5173',
      });
      const id = root + '/entrypoints/popup/index.html';

      document.head.innerHTML = `<link rel="stylesheet" href="${input}" />`;
      pointToDevServer(config, server, id, document as any, 'link', 'href');

      const actual = document.querySelector('link')!;
      expect(actual.getAttribute('href')).toBe(expected);
    });
  });
});
