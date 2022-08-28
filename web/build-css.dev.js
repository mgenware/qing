/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import watch from 'node-watch';
import * as fs from 'node:fs';
import * as np from 'node:path';

const rootDir = 'src';
const destDir = '../userland/static/g/app';
const cssFiles = ['document', 'profile/profileEntry'].map((s) => `./${rootDir}/${s}.css`);

async function build(path) {
  const rpath = np.relative(`./${rootDir}`, path);
  const dest = np.join(destDir, rpath);
  await fs.promises.copyFile(path, dest);
  console.log('Updated CSS:', dest);
}

await Promise.all(cssFiles.map((f) => build(f)));

console.log('Start watching...');
watch(cssFiles, async (_, path) => {
  await build(path);
});
