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
const cssFiles = ['profile/profileEntry'].map((s) => `./${rootDir}/${s}.css`);

watch(cssFiles, async (_, path) => {
  const rpath = np.relative(`./${rootDir}`, path);
  const dest = np.join(destDir, rpath);
  await fs.promises.copyFile(path, dest);
  console.log('Updated CSS:', dest);
});
