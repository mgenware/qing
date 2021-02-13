import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import minifyTemplates from 'rollup-plugin-minify-html-literals';

const isProd = process.env.NODE_ENV == 'production';
console.log(`Build started on ${isProd ? `⚠️⚠️⚠️ PRODUCTION ⚠️⚠️⚠️` : `😜 dev`} mode`);

function preprocessNodeEnv() {
  return replace({
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    __qing_dev__: !isProd,
  });
}

let plugins = [
  nodeResolve({
    browser: true,
    extensions: ['.js', '.json'],
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: `./tsconfig-browser.json`,
  }),
  preprocessNodeEnv(),
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
];
if (!isProd) {
  input.push('devPage/devPageEntry.ts');
}

export default {
  input: input.map((s) => 'src/' + s),
  output: {
    dir: 'static/d/js',
    format: 'system',
    sourcemap: true,
  },
  plugins,
};
