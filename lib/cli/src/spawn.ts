/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import np from 'path';
import {
  print,
  pipedSpawn,
  getMTime,
  readNPMInstallTime,
  writeNPMInstallTime,
  getRootDir,
} from './ioutil.js';

export async function spawnDZCmd(cmd: string, args: string[] | null, daizongDir: string) {
  const rootDir = await getRootDir();
  if (!rootDir) {
    throw new Error('Error finding the project root directory');
  }
  const pkgMtime = await getMTime(np.join(rootDir, 'package.json'));
  const pkgLockMtime = await getMTime(np.join(rootDir, 'pnpm-lock.yaml'));
  const diskTime = Math.max(pkgMtime, pkgLockMtime);
  const installTime = await readNPMInstallTime(rootDir);
  if (diskTime > installTime) {
    print('# Running pnpm install...');
    await pipedSpawn('pnpm', ['i'], rootDir);
    await writeNPMInstallTime(rootDir, new Date().getTime());
  }

  await pipedSpawn('dz', [cmd, ...(args ?? [])], daizongDir);
}

export async function spawnDockerComposeCmd(args: string[], dir: string, configFileName: string) {
  return pipedSpawn('docker', ['compose', '-f', configFileName, ...args], dir);
}

export async function spawnDockerComposeMigrate(
  args: string[],
  dir: string,
  configFileName: string,
) {
  return spawnDockerComposeCmd(['migrate', ...args], dir, configFileName);
}
