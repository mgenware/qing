/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { exec } from 'child_process';
import { execa } from 'execa';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import np from 'path';

const qingDevDirName = '.qing-dev';
const npmInstallTimeFileName = 'npmInstallTime.txt';

const execAsync = promisify(exec);

export function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

export async function getRootDir(): Promise<string> {
  const res = await execAsync('git rev-parse --show-toplevel');
  return res.stdout.trim();
}

export async function getProjectDir(name: string): Promise<string> {
  return np.join(await getRootDir(), name);
}

export async function getVersion(): Promise<string> {
  const dirPath = np.dirname(fileURLToPath(import.meta.url));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const pkgVersion = JSON.parse(await readFile(np.join(dirPath, '../package.json'), 'utf8'))
    .version as string;
  if (!pkgVersion) {
    console.error('Error getting version string.');
    process.exit(1);
  }
  return pkgVersion;
}

export interface SpawnOptions {
  args?: readonly string[];
  workingDir?: string;
  env?: Record<string, string>;
}

export async function pipedSpawn(command: string, opt?: SpawnOptions) {
  return execa(command, opt?.args, {
    stdio: 'inherit',
    cwd: opt?.workingDir,
    env: opt?.env,
  });
}

export async function getMTime(path: string): Promise<number> {
  const { mtime } = await stat(path);
  return mtime.getTime();
}

export async function readNPMInstallTime(dir: string): Promise<number> {
  try {
    const installTimeStr = await readFile(
      np.join(dir, qingDevDirName, npmInstallTimeFileName),
      'utf8',
    );
    return parseInt(installTimeStr.trim(), 10);
  } catch (_) {
    return 0;
  }
}

export async function writeNPMInstallTime(dir: string, time: number) {
  const destDir = np.join(dir, qingDevDirName);
  await mkdir(destDir, { recursive: true });
  await writeFile(np.join(destDir, npmInstallTimeFileName), time.toString());
}
