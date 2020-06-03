import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import litcss from 'rollup-plugin-lit-css-ex';

const isProd = process.env.NODE_ENV == 'production';

const plugins = [
  nodeResolve({
    browser: true,
    extensions: ['.js', '.json', '.css'],
  }),
  commonjs(),
  litcss(),
  json(),
  typescript(),
];

if (isProd) {
  plugins.push(terser());
}

const input = [
  isProd ? 'coreEntry.ts' : 'coreEntryDev.ts',
  'dashboard/dashboardEntry.ts',
  'post/postEntry.ts',
  'profile/profileEntry.ts',
  'auth/authEntry.ts',
];

export default {
  input: input.map((s) => 'src/' + s),
  output: {
    dir: 'static/d/js',
    format: 'system',
    sourcemap: true,
  },
  plugins,
};
