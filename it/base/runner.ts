/* eslint-disable no-console */
/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fg from 'fast-glob';
import chalk from 'chalk';
import { setTimeout as nodeSetTimeout } from 'timers/promises';
// eslint-disable-next-line import/no-unresolved
import PQueue from 'p-queue';
import { debugMode } from './debug';

const glob = process.argv[2];

const queuedTasks: Map<string, PQueue> = new Map();
const tasks: Array<Promise<unknown>> = [];
const globStart = '**';

export async function run(
  name: string,
  dirName: string,
  importFn: (p: string) => Promise<unknown>,
) {
  if (!name) {
    throw new Error('Invalid arguments');
  }
  const entries = await fg([glob ? `${globStart}/*${glob}*.js` : `${globStart}/*.test.js`], {
    dot: true,
    cwd: `./dist/${dirName}`,
    caseSensitiveMatch: false,
  });
  await Promise.all(
    entries.map(async (s) => {
      // eslint-disable-next-line no-console
      console.log(`📄 ${chalk.gray(s)}`);
      await importFn(`./${s}`);
    }),
  );
  await Promise.all(tasks);

  if (entries.length && debugMode()) {
    await nodeSetTimeout(500000);
  } else {
    // eslint-disable-next-line no-console
    console.log(entries.length ? `🎉 ${name} completed successfully.` : '❌ No matching files.');
  }
}

function printTaskResult(name: string, queue: string | undefined, err: Error | null) {
  const colorFn = err ? chalk.red : chalk.green;
  let taskName;
  if (queue) {
    taskName = `${colorFn(name)} ${chalk.gray(`(${queue})`)}`;
  } else {
    taskName = colorFn(name);
  }
  console.log(taskName);
  if (err) {
    console.log(chalk.red(err.message));
  }
}

/**
 * @param {string} name
 * @param {Function} handler
 * @param {string} queue
 * @returns {Promise}
 */
export async function runTask(
  name: string,
  handler: () => Promise<unknown>,
  queue: string | undefined,
) {
  if (typeof name !== 'string' || !name.length) {
    throw new Error(`Invalid \`name\`, got ${name}`);
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }
  try {
    let task;
    if (queue) {
      let q = queuedTasks.get(queue);
      if (!q) {
        q = new PQueue({ concurrency: 1 });
        queuedTasks.set(queue, q);
      }
      task = q.add(handler);
    } else {
      task = handler();
    }
    tasks.push(task);
    await task;
    printTaskResult(name, queue, null);
  } catch (err) {
    printTaskResult(name, queue, err as Error);
    throw err;
  }
}
