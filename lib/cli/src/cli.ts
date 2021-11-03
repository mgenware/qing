#!/usr/bin/env node

/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import nodePath from 'path';
import { fileURLToPath } from 'url';
import errMsg from 'catch-err-msg';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const qingDevDirName = '.qing-dev';
const npmInstallTimeFileName = 'npmInstallTime.txt';
const migrateCmd = 'docker compose run migrate';
const composeUpCmd = 'docker compose up';

if (process.platform === 'win32') {
  console.error('Qing CLI does not support Windows, please use WSL2 on Windows.');
  process.exit(1);
}

const dirPath = nodePath.dirname(fileURLToPath(import.meta.url));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = JSON.parse(await readFile(nodePath.join(dirPath, '../package.json'), 'utf8'));

const args = process.argv.slice(2);

function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

function printUsage() {
  // eslint-disable-next-line no-console
  console.log(`
    Usage
      $ qing <command> [command arguments]
    Command
      w               Build web files
      s               Build and start server in containers
      s-f             Build and start server in containers (force recreation)
      s-l             Build and start server locally
      d <arg>         Run scripts in '/lib/dev'
        conf            - Rebuild config files
        const           - Rebuild shared constants
        da              - Rebuild data access layer
        ls              - Rebuild localized strings
      migrate <arg>   Run database migrations
        +<N>            - Apply N up migrations
        -<N>            - Apply N down migrations
        <N>             - Migrate to version N
        drop            - Drop everything in database
      rootdir         Print project root directory
      help            Print help information
      version         Print version information
      
  `);
}

const inputCmd = args[0];
const arg1 = args[1];

if (!inputCmd) {
  console.error('No input commands');
  process.exit(1);
}

const webDir = 'web';
const serverDir = 'server';
const libDev = 'lib/dev';

async function getRootDir(): Promise<string> {
  const res = await execAsync('git rev-parse --show-toplevel');
  return res.stdout.trim();
}

async function getProjectDir(name: string): Promise<string> {
  return nodePath.join(await getRootDir(), name);
}

function checkArg(s: string | undefined, name: string): asserts s {
  if (!s) {
    throw new Error(`"${name}" is undefined`);
  }
}

async function spawnCmd(cmd: string, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, {
      shell: true,
      stdio: 'inherit',
      cwd,
    });
    process.on('close', (code) => {
      if (code) {
        reject(new Error(`Command failed with code ${code} (${cmd})`));
      } else {
        resolve();
      }
    });
    process.on('error', (err) => {
      reject(err);
    });
  });
}

async function mtime(path: string): Promise<number> {
  const { mtime } = await stat(path);
  return mtime.getTime();
}

async function readNPMInstallTime(dir: string): Promise<number> {
  try {
    const installTimeStr = await readFile(
      nodePath.join(dir, qingDevDirName, npmInstallTimeFileName),
      'utf8',
    );
    return parseInt(installTimeStr.trim(), 10);
  } catch (_) {
    return 0;
  }
}

async function writeNPMInstallTime(dir: string, time: number): Promise<void> {
  const destDir = nodePath.join(dir, qingDevDirName);
  await mkdir(destDir, { recursive: true });
  await writeFile(nodePath.join(destDir, npmInstallTimeFileName), time.toString());
}

async function spawnNPMCmd(cmd: string, dir: string): Promise<void> {
  const pkgMtime = await mtime(nodePath.join(dir, 'package.json'));
  const pkgLockMtime = await mtime(nodePath.join(dir, 'package-lock.json'));
  const diskTime = Math.max(pkgMtime, pkgLockMtime);
  const installTime = await readNPMInstallTime(dir);
  if (diskTime > installTime) {
    console.log('# package.json or lock file changed, re-run npm install...');
    await spawnCmd('npm i', dir);
    await writeNPMInstallTime(dir, new Date().getTime());
  } else {
    console.log('# package.json or lock file not changed.');
  }

  await spawnCmd(cmd, dir);
}

function checkMigrationNumber(num: number) {
  if (num < 1) {
    throw new Error(`Migration number must be greater than or equal to 1, got ${num}.`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    switch (inputCmd) {
      case 'help': {
        printUsage();
        break;
      }

      case 'version': {
        print(pkg.version);
        break;
      }

      case 'rootdir': {
        print(await getRootDir());
        break;
      }

      case 'w': {
        await spawnNPMCmd('npm run r dev', await getProjectDir(webDir));
        break;
      }

      case 's': {
        await spawnCmd(composeUpCmd, await getProjectDir(serverDir));
        break;
      }

      case 's-f': {
        await spawnCmd(composeUpCmd + ' --force-recreate', await getProjectDir(serverDir));
        break;
      }

      case 's-l': {
        await spawnCmd('go run main.go dev', await getProjectDir(serverDir));
        break;
      }

      case 'd': {
        checkArg(arg1, 'arg1');
        await spawnNPMCmd(`npm run r ${arg1}`, await getProjectDir(libDev));
        break;
      }

      case 'migrate': {
        checkArg(arg1, 'arg1');
        if (arg1 === 'drop') {
          await spawnCmd(`${migrateCmd} drop`, await getProjectDir(serverDir));
        } else if (arg1.startsWith('+') || arg1.startsWith('-')) {
          const num = parseInt(arg1.substr(1), 10);
          checkMigrationNumber(num);
          await spawnCmd(
            `${migrateCmd} ${arg1[0] === '+' ? 'up' : 'down'} ${num}`,
            await getProjectDir(serverDir),
          );
        } else {
          const num = parseInt(arg1, 10);
          checkMigrationNumber(num);
          await spawnCmd(`${migrateCmd} goto ${num}`, await getProjectDir(serverDir));
        }
        break;
      }

      default: {
        throw new Error(`Unknown command "${inputCmd}"`);
      }
    }
  } catch (err) {
    console.error(`Error: ${errMsg(err)}`);
    process.exit(1);
  }
})();
