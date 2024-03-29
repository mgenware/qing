/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import esbuild from 'esbuild';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';

const args = process.argv.slice(2);
const config = args[0];
const watchFlag = args[1] === '-w';

if (!config) {
  throw new Error('Missing config name');
}

const isDev = config === 'dev';
const isProd = config === 'prod';

const envMap = {
  // Replacement values can only be strings.
  dev: {
    'window.__qing_dev__': 'true',
  },
  br: {
    'window.__qing_br__': 'true',
  },
  prod: {
    'window.__qing_dev__': 'false',
    'window.__qing_br__': 'false',
  },
};

const jsEntries = [
  'core',
  'i/iEntry',
  'admin/adminEntry',
  'post/postEntry',
  'profile/profileEntry',
  'auth/authEntry',
  'home/homeStdEntry',
  'home/homeFrmEntry',
  'forum/forumEntry',
  'forum/forumSettingsEntry',
  'lang/langEntry',
  'devPage/devPageEntry',
].map((s) => `src/${s}.ts`);

const cssEntries = ['mainEntry', 'profileEntry', 'homeStdEntry'].map((s) => `src/css/${s}.css`);

const plugins = [];
if (!isDev) {
  plugins.push(minifyHTMLLiteralsPlugin());
}

console.log(`[esb.js] TS building in ${config} mode...`);

const userlandOutDir = 'userland/static/g';
const opt = {
  entryPoints: [...jsEntries, ...cssEntries],
  bundle: true,
  outdir: isProd ? `../build/qing_bundle/${userlandOutDir}` : `../${userlandOutDir}`,
  minify: !isDev,
  splitting: true,
  format: 'esm',
  entryNames: '[ext]/[name]-[hash]',
  tsconfig: './tsconfig.json',
  define: {
    this: 'window',
    ...envMap[config],
  },
  target: [
    // Based on https://caniuse.com/mdn-css_selectors_part
    'es2020',
    'chrome73',
    'edge79',
    'firefox72',
    'ios13.4',
    'safari13.1',
  ],
  plugins,
  external: ['*.png', '*.jpg', '*.jpeg', '*.avif'],
};

console.log(`esbuild ${watchFlag ? '[watch]' : '[build]'}`);
if (watchFlag) {
  const ctx = await esbuild.context(opt);
  await ctx.watch();
  await ctx.rebuild();
} else {
  await esbuild.build(opt);
}
