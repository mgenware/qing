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
const watch = args[1] === '-w';

if (!config) {
  throw new Error('Missing config name');
}

function isDev() {
  return config === 'dev';
}

function isProd() {
  return config === 'prod';
}

const envMap = {
  dev: {
    'window.__qing_dev__': true,
  },
  br: {
    'window.__qing_br__': true,
  },
};

const entryPoints = [
  'core',
  'm/mEntry',
  'mx/mxEntry',
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

const plugins = [];
if (!isDev()) {
  plugins.push(minifyHTMLLiteralsPlugin());
}

esbuild.build({
  entryPoints,
  bundle: true,
  outdir: '../userland/static/g/app',
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
  watch,
});
