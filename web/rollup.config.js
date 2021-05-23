/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import litcss from 'rollup-plugin-lit-css';
import minifyTemplates from 'rollup-plugin-minify-html-literals';

const isProd = process.env.NODE_ENV == 'production';
console.log(`Build started on ${isProd ? `⚠️⚠️⚠️ PRODUCTION ⚠️⚠️⚠️` : `😜 dev`} mode`);

let plugins = [
  nodeResolve({
    browser: true,
    extensions: ['.js', '.css'],
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
  }),
  litcss(),
];

if (isProd) {
  plugins = [
    // Minifying templates should always run first.
    minifyTemplates(),
    ...plugins,
    terser(),
  ];
}

const input = [
  isProd ? 'coreEntry.ts' : 'coreEntryDev.ts',
  'm/mEntry.ts',
  'mx/mxEntry.ts',
  'post/postEntry.ts',
  'discussion/discussionEntry.ts',
  'profile/profileEntry.ts',
  'auth/authEntry.ts',
  'home/homeStdEntry.ts',
  'home/homeFrmEntry.ts',
  'forum/forumEntry.ts',
  'forum/forumSettingsEntry.ts',
  'lang/langEntry.ts',
  'qna/qnaEntry.ts',
];
if (!isProd) {
  input.push('devPage/devPageEntry.ts');
}

export default {
  input: input.map((s) => 'src/' + s),
  output: {
    dir: '../userland/static/d/js',
    format: 'system',
    sourcemap: true,
  },
  plugins,
  onwarn: function (warning) {
    // Skip certain warnings.
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    // console.warn everything else.
    console.warn(warning.message);
  },
};
