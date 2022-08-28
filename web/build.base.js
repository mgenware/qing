/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import esbuild from 'esbuild';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';

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

export default function build(params) {
  return esbuild.build({
    entryPoints,
    bundle: true,
    outdir: '../userland/static/g/app',
    define: {
      this: 'window',
      ...params.env,
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
    plugins: [minifyHTMLLiteralsPlugin()],
  });
}
