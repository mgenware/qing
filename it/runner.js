/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fg from 'fast-glob';
import chalk from 'chalk';
import PQueue from 'p-queue';

const glob = process.argv[2];

/**
 * @returns {Promise}
 */
export async function run(importFn) {
  const entries = await fg([glob ? `**/*${glob}*.js` : '**/*_test.js'], { dot: true });
  await Promise.all(
    entries.map(async (s) => {
      // eslint-disable-next-line no-console
      console.log(chalk.gray(s));
      importFn(`./${s}`);
    }),
  );
}

/** @type {Map<string, PQueue>} */
const queuedTasks = new Map();

/**
 * @param {string} name
 * @returns {Promise}
 */
export async function queueTask(name, handler) {
  let q = queuedTasks.get(name);
  if (!q) {
    q = new PQueue({ concurrency: 1 });
  }
  await q.add(handler);
}
