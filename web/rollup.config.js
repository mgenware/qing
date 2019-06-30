import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import litcss from 'rollup-plugin-lit-css';
import json from 'rollup-plugin-json';

const isProd = process.env.NODE_ENV == 'production';

const plugins = [
  nodeResolve({
    browser: true,
    extensions: ['.mjs', '.js', '.jsx', '.json', '.css'],
  }),
  commonjs(),
  litcss(),
  json(),
  typescript({ cacheRoot: require('unique-temp-dir')() }),
];

if (isProd) {
  plugins.push(terser());
}

const tasks = [
  {
    input: ['src/main_dev.ts'],
    output: {
      dir: isProd ? 'dist' : 'dist_dev',
      format: 'system',
      sourcemap: true,
    },
    plugins,
  },
];

export default tasks;
