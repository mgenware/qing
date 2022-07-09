/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const esbuild = require('esbuild');

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
].map((s) => `dist/${s}.js`);

esbuild
  .build({
    entryPoints,
    bundle: true,
    outdir: '../userland/static/g/app',
    define: {
      'window.__qing_dev__': true,
      this: 'window',
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
  })
  .catch(() => process.exit(1));
