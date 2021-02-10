import convert from 'string-to-template-literal';
import { promises as fsPromises } from 'fs';

const src = './dist/main.min.css';
const dest = './dist/main.js';
const destDTS = './dist/main.d.ts';
const escapedCSS = convert(await fsPromises.readFile(src, 'utf8'));
const code = `import { css } from 'lit-element';export default css${escapedCSS};`;
await fsPromises.writeFile(dest, code);
await fsPromises.writeFile(
  destDTS,
  `declare const _default: import("lit-element").CSSResult;
export default _default;`,
);
