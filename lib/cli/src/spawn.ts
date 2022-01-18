/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import np from 'path';
import { print, pipedSpawn, getMTime, readNPMInstallTime, writeNPMInstallTime } from './ioutil.js';

export async function spawnDZCmd(cmd: string, args: string[] | null, dir: string) {
  const pkgMtime = await getMTime(np.join(dir, 'package.json'));
  const pkgLockMtime = await getMTime(np.join(dir, 'package-lock.json'));
  const diskTime = Math.max(pkgMtime, pkgLockMtime);
  const installTime = await readNPMInstallTime(dir);
  if (diskTime > installTime) {
    print('# package.json or lock file changed, re-run npm install...');
    await pipedSpawn('npm', ['i'], dir);
    await writeNPMInstallTime(dir, new Date().getTime());
  }

  await pipedSpawn('dz', [cmd, ...(args ?? [])], dir);
}

export async function spawnDockerComposeCmd(args: string[], dir: string) {
  return pipedSpawn('docker', ['compose', ...args], dir);
}

export async function spawnDockerComposeMigrate(args: string[], dir: string) {
  return pipedSpawn('docker', ['compose', 'run', 'migrate', ...args], dir);
}
