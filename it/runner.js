/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fg from 'fast-glob';
import chalk from 'chalk';

/**
 * @returns {Promise}
 */
export async function run(importFn) {
  const entries = await fg(['**/*_test.js'], { dot: true });
  await Promise.all(
    entries.map(async (s) => {
      console.log(chalk.gray(s));
      importFn(`./${s}`);
    }),
  );
}
