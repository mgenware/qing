/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import watch from 'node-watch';
import { promises as fs } from 'node:fs';
import * as np from 'node:path';

const rootDir = 'src';
const destDir = '../userland/static/g/app';
const cssFiles = ['document', 'profile/profileEntry', 'home/homeStdEntry'].map(
  (s) => `./${rootDir}/${s}.css`,
);
const documentCSSRelPath = 'document.css';

const qingBaseCSS = await fs.readFile('./node_modules/qing-css-base/dist/main.min.css', 'utf8');

async function build(path) {
  const rpath = np.relative(`./${rootDir}`, path);
  const dest = np.join(destDir, rpath);
  if (rpath === documentCSSRelPath) {
    // If it's document.css, prepend `qing-css-base` css.
    const documentCSS = await fs.readFile(path, 'utf8');
    await fs.writeFile(dest, `${qingBaseCSS}${documentCSS}`);
    console.log('Merged base CSS into document.css');
  } else {
    await fs.copyFile(path, dest);
  }
  console.log('Updated CSS:', dest);
}

await Promise.all(cssFiles.map((f) => build(f)));

console.log('Start watching...');
watch(cssFiles, async (_, path) => {
  await build(path);
});
