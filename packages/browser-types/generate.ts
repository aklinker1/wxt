import { downloadTemplate } from 'giget';
import fs from 'fs-extra';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';

const generatedDir = 'npm/gen';
const templatesDir = 'templates';
const joinGenerated = (...path: string[]) => join(generatedDir, ...path);
const joinTemplate = (...path: string[]) => join(templatesDir, ...path);

// Clone the code

await fs.ensureDir(generatedDir);
await fs.emptyDir(generatedDir);

console.log('Fetching latest version details...');
const chromeMeta = JSON.parse(
  execSync('npm view @types/chrome --json', { encoding: 'utf8' }),
);

console.log('Downloading latest files from @types/chrome');
const files = await downloadFolder(
  'DefinitelyTyped/DefinitelyTyped',
  'types/chrome',
);
console.log(
  'Downloaded:',
  files.map((file) => file.path),
);

// Update code

const pkgJson = await fs.readJson(`${templatesDir}/package.json`);
pkgJson.version = chromeMeta.version;
pkgJson.dependencies = chromeMeta.dependencies;

// Write output

await fs.copyFile(joinTemplate('README.md'), joinGenerated('README.md'));
await fs.writeJson(joinGenerated('package.json'), pkgJson, { spaces: 2 });
for (const file of files) {
  const path = file.path.replace('types/chrome', generatedDir);
  await fs.ensureDir(dirname(path));
  await fs.writeFile(
    path,
    file.text
      .replaceAll('chrome: typeof chrome', 'browser: typeof browser')
      .replaceAll('declare namespace chrome', 'declare namespace browser')
      .replaceAll('chrome.', 'browser.'),
    'utf8',
  );
}

///
/// UTILS
///

async function downloadFolder(repo: string, path: string) {
  const res: Array<{ path: string; text: string }> = [];
  const queue = [path];

  while (queue.length > 0) {
    const folder = queue.shift()!;
    console.log('Loading folder:', path);
    const files = await githubFetch(`/repos/${repo}/contents/${folder}`);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'dir') {
        queue.push(file.path);
      } else if (file.type === 'file' && file.name.endsWith('.d.ts')) {
        console.log('Downloading:', file.path);
        const text = await githubFetch(file.download_url, 'text');
        res.push({ path: file.path, text });
      }
    }
  }

  return res;
}

async function githubFetch(
  path: string,
  method: 'json' | 'text' = 'json',
): Promise<any> {
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  const url = new URL(path, 'https://api.github.com');
  const response = await fetch(url.href, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    console.log(await response.text());
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response[method]();
}
