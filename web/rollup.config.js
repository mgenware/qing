import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import litcss from 'rollup-plugin-lit-css';
import replace from '@rollup/plugin-replace';

const isProd = process.env.NODE_ENV == 'production';

function preprocessNodeEnv() {
  return replace({
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    __qing_dev__: !isProd,
  });
}

const plugins = [
  nodeResolve({
    browser: true,
    extensions: ['.js', '.json', '.css'],
  }),
  commonjs(),
  litcss(),
  json(),
  typescript({
    tsconfig: './tsconfig-build.json',
  }),
  preprocessNodeEnv(),
];

if (isProd) {
  plugins.push(terser(), preprocessNodeEnv());
}

const input = [
  isProd ? 'coreEntry.ts' : 'coreEntryDev.ts',
  'dashboard/dashboardEntry.ts',
  'post/postEntry.ts',
  'discussion/discussionEntry.ts',
  'profile/profileEntry.ts',
  'auth/authEntry.ts',
  'home/homeStdEntry.ts',
  'home/homeFrmEntry.ts',
  'forum/forumEntry.ts',
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
