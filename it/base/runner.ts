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
import globalContext from './globalContext';
import pMap from 'p-map';
import PQueue from 'p-queue';
import { debugMode } from './debug';

const args = process.argv.slice(2);
const fileGlob = args[0];
const nameFilter = args[1];
if (nameFilter) {
  globalContext.nameFilter = nameFilter;
}

const globStart = '**';
const taskQueue = new PQueue({ concurrency: 10 });

function print(arg: unknown) {
  // eslint-disable-next-line no-console
  console.log(arg);
}

export async function startRunner(
  name: string,
  dirName: string,
  importFn: (p: string) => Promise<unknown>,
) {
  if (!name) {
    throw new Error('Invalid arguments');
  }
  const entries = await fg(
    [fileGlob ? `${globStart}/*${fileGlob}*.test.js` : `${globStart}/*.test.js`],
    {
      dot: true,
      cwd: `./dist/${dirName}`,
      caseSensitiveMatch: false,
    },
  );

  await pMap(
    entries,
    async (s) => {
      print(`📄 ${chalk.gray(s)}`);
      await importFn(`./${s}`);
    },
    { concurrency: 5 },
  );
  // All files are handled here, meaning all tasks are queued.
  // Wait for all tasks to complete.
  await taskQueue.onIdle();

  if (entries.length && debugMode()) {
    await nodeSetTimeout(500000);
  } else {
    print(entries.length ? `🎉 ${name} completed successfully.` : '❌ No matching files.');
  }
}

function printTaskResult(name: string, err: Error | null) {
  const colorFn = err ? chalk.red : chalk.green;
  const taskName = colorFn(name);
  print(taskName);
  if (err) {
    print(chalk.red(err.message));
  }
}

export async function runTask(name: string, handler: () => Promise<unknown>) {
  if (typeof name !== 'string' || !name.length) {
    throw new Error(`Invalid \`name\`, got ${name}`);
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }
  try {
    await taskQueue.add(() => handler());
    printTaskResult(name, null);
  } catch (err) {
    if (err instanceof Error) {
      printTaskResult(name, err);
    } else {
      console.error(`Error: ${err}`);
      console.trace();
      process.exit(1);
    }
    if (debugMode()) {
      console.error(`ERROR: ${err.message}`);
      console.error(`${err.stack}`);
    } else {
      throw err;
    }
  }
}
