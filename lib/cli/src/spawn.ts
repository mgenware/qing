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

export async function spawnDZCmd(e: { cmd: string; args: string[] | null; daizongDir: string }) {
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

  await pipedSpawn('dz', { args: [e.cmd, ...(e.args ?? [])], workingDir: e.daizongDir });
}

export async function spawnDockerComposeCmd(e: {
  args: string[];
  dir: string;
  configName: string;
  env?: Record<string, string>;
}) {
  return pipedSpawn('docker', {
    args: ['compose', '-f', 'dev.docker-compose.yml', ...e.args],
    workingDir: e.dir,
    env: { QING_DEV_CONF: e.configName, QING_DEV_SITE_ST: '1', ...e.env },
  });
}

export async function spawnDockerComposeMigrate(e: {
  args: string[];
  dir: string;
  configName: string;
}) {
  return spawnDockerComposeCmd({
    args: ['run', 'migrate', ...e.args],
    dir: e.dir,
    configName: e.configName,
  });
}
