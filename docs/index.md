---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Next-gen Web Extension Framework

hero:
  name: WXT
  text: Next-gen Web Extension Framework
  tagline: An open source tool that makes web extension development faster than ever before.
  image:
    src: /hero-logo.svg
    alt: WXT
  actions:
    - theme: brand
      text: Get Started
      link: /guide/installation
    - theme: alt
      text: Learn More
      link: /guide/introduction

features:
  - icon: 🌐
    title: Supported Browsers
    details: WXT will build extensions for Chrome, Firefox, Edge, Safari, and any Chromium based browser.
    link: /guide/essentials/target-different-browsers
    linkText: Read docs
  - icon: ✅
    title: MV2 and MV3
    details: Build Manifest V2 or V3 extensions for any browser using the same codebase.
    link: /guide/essentials/config/manifest
    linkText: Read docs
  - icon: ⚡
    title: Fast Dev Mode
    details: Lightning fast HMR for UI development and fast reloads for content/background scripts enables faster iterations.
  - icon: 📂
    title: File Based Entrypoints
    details: Manifest is generated based on files in the project with inline configuration.
    link: /guide/essentials/project-structure
    linkText: See project structure
  - icon: 🚔
    title: TypeScript
    details: Create large projects with confidence using TS by default.
  - icon: 🦾
    title: Auto-imports
    details: Nuxt-like auto-imports to speed up development.
    link: /guide/essentials/config/auto-imports
    linkText: Read docs
  - icon: 🤖
    title: Automated Publishing
    details: Automatically zip, upload, submit, and publish extensions.
  - icon: 🎨
    title: Frontend Framework Agnostic
    details: Works with any front-end framework with a Vite plugin.
    link: /guide/essentials/frontend-frameworks
    linkText: Add a framework
  - icon: 📦
    title: Module System
    details: Reuse build-time and runtime-code across multiple extensions.
    link: /guide/essentials/wxt-modules
    linkText: Read docs
  - icon: 🖍️
    title: Bootstrap a New Project
    details: Get started quickly with several awesome project templates.
    link: /guide/installation#bootstrap-project
    linkText: See templates
  - icon: 📏
    title: Bundle Analysis
    details: Tools for analyzing the final extension bundle and minimizing your extension's size.
  - icon: ⬇️
    title: Bundle Remote Code
    details: Downloads and bundles remote code imported from URLs.
    link: /guide/essentials/remote-code
    linkText: Read docs
---

## Sponsors

WXT is a [MIT-licensed](https://github.com/wxt-dev/wxt/blob/main/LICENSE) open source project with its ongoing development made possible entirely by the support of these awesome backers. If you'd like to join them, please consider [sponsoring WXT's development](https://github.com/sponsors/wxt-dev).

[![WXT Sponsors](https://raw.githubusercontent.com/wxt-dev/static/refs/heads/main/sponsorkit/sponsors-wide.svg)](https://github.com/sponsors/wxt-dev)

## Put <span style="color: var(--vp-c-brand-1)">Developer Experience</span> First

WXT simplifies the web extension development process by providing tools for zipping and publishing, the best-in-class dev mode, an opinionated project structure, and more. Iterate faster, develop features not build scripts, and use everything the JS ecosystem has to offer.

<div style="margin: auto; width: 100%; max-width: 900px; text-align: center">
  <video src="https://github.com/wxt-dev/wxt/assets/10101283/4d678939-1bdb-495c-9c36-3aa281d84c94" controls></video>
  <br />
  <small>
    And who doesn't appreciate a beautiful CLI?
  </small>
</div>

## Who's Using WXT?

Battle tested and ready for production. Explore web extensions made with WXT.

<ClientOnly>
  <UsingWxtSection />
</ClientOnly>
