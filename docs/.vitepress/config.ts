import { defineConfig } from 'vitepress';
import typedocSidebar from '../api/reference/typedoc-sidebar.json';
import {
  menuGroup,
  menuItem,
  menuRoot,
  navItem,
  prepareTypedocSidebar,
} from './utils/menus';
import { meta, script } from './utils/head';
import footnote from 'markdown-it-footnote';
import { version as wxtVersion } from '../../packages/wxt/package.json';
import { version as i18nVersion } from '../../packages/i18n/package.json';
import { version as autoIconsVersion } from '../../packages/auto-icons/package.json';
import { version as unocssVersion } from '../../packages/unocss/package.json';
import { version as storageVersion } from '../../packages/storage/package.json';
import { Feed } from 'feed';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const origin = 'https://wxt.dev';

const title = 'Next-gen Web Extension Framework';
const titleSuffix = ' – WXT';
const description =
  "WXT provides the best developer experience, making it quick, easy, and fun to develop web extensions. With built-in utilities for building, zipping, and publishing your extension, it's easy to get started.";
const ogTitle = `${title}${titleSuffix}`;
const ogUrl = origin;
const ogImage = `${origin}/social-preview.png`;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  titleTemplate: `:title${titleSuffix}`,
  title: 'WXT',
  description,
  vite: {
    clearScreen: false,
  },
  lastUpdated: true,
  sitemap: {
    hostname: origin,
  },

  async buildEnd(site) {
    // Only construct the RSS document for production builds
    const { default: blogDataLoader } = await import('./loaders/blog.data');
    const posts = await blogDataLoader.load();
    const feed = new Feed({
      copyright: 'MIT',
      id: 'wxt',
      title: 'WXT Blog',
      link: `${origin}/blog`,
    });
    posts.forEach((post) => {
      feed.addItem({
        date: post.frontmatter.date,
        link: new URL(post.url, origin).href,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
      });
    });
    console.log('rss.xml:');
    console.log(feed.rss2());
    await writeFile(join(site.outDir, 'rss.xml'), feed.rss2(), 'utf8');
  },

  head: [
    meta('og:type', 'website'),
    meta('og:title', ogTitle),
    meta('og:image', ogImage),
    meta('og:url', ogUrl),
    meta('og:description', description),
    meta('twitter:card', 'summary_large_image', { useName: true }),
    script('https://umami.aklinker1.io/script.js', {
      'data-website-id': 'c1840c18-a12c-4a45-a848-55ae85ef7915',
      async: '',
    }),
  ],

  markdown: {
    config: (md) => {
      md.use(footnote);
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: '/logo.svg',
      alt: 'WXT logo',
    },

    footer: {
      message: [
        '<a class="light-netlify" href="https://www.netlify.com"> <img src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg" alt="Deploys by Netlify" style="display: inline;" /></a>',
        '<a class="dark-netlify" href="https://www.netlify.com"> <img src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg" alt="Deploys by Netlify" style="display: inline;" /></a>',
        'Released under the <a href="https://github.com/wxt-dev/wxt/blob/main/LICENSE">MIT License</a>.',
      ].join('<br/>'),
      copyright:
        'Copyright © 2023-present <a href="https://github.com/aklinker1">Aaron Klinker</a>',
    },

    editLink: {
      pattern: 'https://github.com/wxt-dev/wxt/edit/main/docs/:path',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/ZFsZqGery9' },
      { icon: 'github', link: 'https://github.com/wxt-dev/wxt' },
    ],

    nav: [
      navItem('Guide', '/guide/installation'),
      navItem('Examples', '/examples'),
      navItem('API', '/api/reference/wxt'),
      navItem('Blog', '/blog'),
      navItem(`v${wxtVersion}`, [
        navItem('wxt', [
          navItem(`v${wxtVersion}`, '/'),
          navItem(
            `Changelog`,
            'https://github.com/wxt-dev/wxt/blob/main/packages/wxt/CHANGELOG.md',
          ),
        ]),
        navItem('Other Packages', [
          navItem(`@wxt-dev/storage — ${storageVersion}`, '/storage'),
          navItem(`@wxt-dev/auto-icons — ${autoIconsVersion}`, '/auto-icons'),
          navItem(`@wxt-dev/i18n — ${i18nVersion}`, '/i18n'),
          navItem(`@wxt-dev/unocss — ${unocssVersion}`, '/unocss'),
        ]),
      ]),
    ],

    sidebar: {
      '/guide/': menuRoot([
        menuGroup('Get Started', '/guide/', [
          menuItem('Introduction', 'introduction.md'),
          menuItem('Installation', 'installation.md'),
        ]),
        menuGroup('Essentials', '/guide/essentials/', [
          menuItem('Project Structure', 'project-structure.md'),
          menuItem('Entrypoints', 'entrypoints.md'),
          menuGroup(
            'Configuration',
            '/guide/essentials/config/',
            [
              menuItem('Manifest', 'manifest.md'),
              menuItem('Browser Startup', 'browser-startup.md'),
              menuItem('Auto-imports', 'auto-imports.md'),
              menuItem('Environment Variables', 'environment-variables.md'),
              menuItem('Runtime Config', 'runtime.md'),
              menuItem('Vite', 'vite.md'),
              menuItem('Build Mode', 'build-mode.md'),
              menuItem('TypeScript', 'typescript.md'),
              menuItem('Hooks', 'hooks.md'),
              menuItem('Entrypoint Loaders', 'entrypoint-loaders.md'),
            ],
            true,
          ),
          menuItem('Extension APIs', 'extension-apis.md'),
          menuItem('Assets', 'assets.md'),
          menuItem('Target Different Browsers', 'target-different-browsers.md'),
          menuItem('Content Scripts', 'content-scripts.md'),
          menuItem('Storage', 'storage.md'),
          menuItem('Messaging', 'messaging.md'),
          menuItem('I18n', 'i18n.md'),
          menuItem('Scripting', 'scripting.md'),
          menuItem('WXT Modules', 'wxt-modules.md'),
          menuItem('Frontend Frameworks', 'frontend-frameworks.md'),
          menuItem('ES Modules', 'es-modules.md'),
          menuItem('Remote Code', 'remote-code.md'),
          menuItem('Unit Testing', 'unit-testing.md'),
          menuItem('E2E Testing', 'e2e-testing.md'),
          menuItem('Publishing', 'publishing.md'),
          menuItem('Testing Updates', 'testing-updates.md'),
        ]),
        menuGroup('Resources', '/guide/resources/', [
          menuItem('Compare', 'compare.md'),
          menuItem('FAQ', 'faq.md'),
          menuItem('Upgrading WXT', 'upgrading.md'),
          menuItem('Migrate to WXT', 'migrate.md'),
          menuItem('How WXT Works', 'how-wxt-works.md'),
        ]),
      ]),
      '/api/': menuRoot([
        menuGroup(
          'CLI Reference',
          '/api/cli/',
          [
            menuItem('wxt', 'wxt.md'),
            menuItem('wxt build', 'wxt-build.md'),
            menuItem('wxt zip', 'wxt-zip.md'),
            menuItem('wxt prepare', 'wxt-prepare.md'),
            menuItem('wxt clean', 'wxt-clean.md'),
            menuItem('wxt init', 'wxt-init.md'),
            menuItem('wxt submit', 'wxt-submit.md'),
            menuItem('wxt submit init', 'wxt-submit-init.md'),
          ],
          true,
        ),
        menuGroup('API Reference', prepareTypedocSidebar(typedocSidebar), true),
      ]),
    },
  },
});
