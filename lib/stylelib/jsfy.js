import convert from 'string-to-template-literal';
import { promises as fsPromises } from 'fs';

const src = './dist/stylelib.min.css';
const dest = './dist/stylelib.js';
const escapedCSS = convert(await fsPromises.readFile(src, 'utf8'));
const code = `import { css } from 'lit-element';export default css${escapedCSS};`;
await fsPromises.writeFile(dest, code);
