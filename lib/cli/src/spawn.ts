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
    await pipedSpawn('pnpm', { args: ['i'], workingDir: rootDir });
    await writeNPMInstallTime(rootDir, new Date().getTime());
  }

  await pipedSpawn('dz', { args: [cmd, ...(args ?? [])], workingDir: daizongDir });
}

export async function spawnDockerComposeCmd(args: string[], dir: string, configName: string) {
  return pipedSpawn('docker', {
    args: ['compose', '-f', 'dev.docker-compose.yml', ...args],
    workingDir: dir,
    env: { QING_DEV_CONF: configName },
  });
}

export async function spawnDockerComposeMigrate(
  args: string[],
  dir: string,
  configFileName: string,
) {
  return spawnDockerComposeCmd(['run', 'migrate', ...args], dir, configFileName);
}
