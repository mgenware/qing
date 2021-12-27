#!/usr/bin/env node

/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import np from 'path';
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

const processArgs = process.argv.slice(2);

function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

async function getVersion(): Promise<string> {
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

function printUsage() {
  print(`
    Usage
      $ qing <command> [command arguments]
    Command
      w or f          Build and watch web files
      s or b          Build and start server in containers
      s-f             Build and start server in containers (force recreation)
      s-l             Build and start server locally
      conf            Build config files
      const           Build shared constants
      da              Build data access layer
      ls              Build localized strings
      sod <arg>       Build SOD (Shared Object Definition)           
      it <arg>        Run integration tests
        dev             - Start development (default)
        all             - Run all integration tests
        api             - Run API tests
        br              - Run browser (E2E) tests
      migrate <arg>   Run database migrations
        +<N>            - Apply N up migrations
        -<N>            - Apply N down migrations
        <N>             - Migrate to version N
        drop            - Drop everything in database
      rootdir         Print project root directory
      version         Print version information
      
  `);
}

const inputCmd = processArgs[0];

if (!inputCmd) {
  printUsage();
  process.exit(0);
}

const webDir = 'web';
const serverDir = 'server';
const libDevDir = 'lib/dev';
const itDir = 'it';
const npmRunR = 'npm run r';

async function getRootDir(): Promise<string> {
  const res = await execAsync('git rev-parse --show-toplevel');
  return res.stdout.trim();
}

async function getProjectDir(name: string): Promise<string> {
  return np.join(await getRootDir(), name);
}

function checkArg(s: string | undefined, name: string): asserts s {
  if (!s) {
    throw new Error(`"${name}" is undefined`);
  }
}

async function spawnCmd(command: string, workingDir: string, args: string[] | null): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(args?.length ? `${command} ${args.join(' ')}` : command, {
      shell: true,
      stdio: 'inherit',
      cwd: workingDir,
    });
    process.on('close', (code) => {
      if (code) {
        reject(new Error(`Command failed with code ${code} (${command})`));
      } else {
        resolve();
      }
    });
    process.on('error', (err) => {
      reject(err);
    });
  });
}

async function getMTime(path: string): Promise<number> {
  const { mtime } = await stat(path);
  return mtime.getTime();
}

async function readNPMInstallTime(dir: string): Promise<number> {
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

async function writeNPMInstallTime(dir: string, time: number): Promise<void> {
  const destDir = np.join(dir, qingDevDirName);
  await mkdir(destDir, { recursive: true });
  await writeFile(np.join(destDir, npmInstallTimeFileName), time.toString());
}

async function spawnNPMCmd(cmd: string, dir: string, args: string[] | null): Promise<void> {
  const pkgMtime = await getMTime(np.join(dir, 'package.json'));
  const pkgLockMtime = await getMTime(np.join(dir, 'package-lock.json'));
  const diskTime = Math.max(pkgMtime, pkgLockMtime);
  const installTime = await readNPMInstallTime(dir);
  if (diskTime > installTime) {
    print('# package.json or lock file changed, re-run npm install...');
    await spawnCmd('npm i', dir, null);
    await writeNPMInstallTime(dir, new Date().getTime());
  } else {
    print('# package.json or lock file not changed.');
  }

  await spawnCmd(cmd, dir, args);
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
      case 'version': {
        print(await getVersion());
        break;
      }

      case 'rootdir': {
        print(await getRootDir());
        break;
      }

      case 'w':
      case 'f': {
        await spawnNPMCmd(`${npmRunR} dev`, await getProjectDir(webDir), null);
        break;
      }

      case 's':
      case 'b': {
        await spawnCmd(composeUpCmd, await getProjectDir(serverDir), null);
        break;
      }

      case 's-f': {
        await spawnCmd(composeUpCmd + ' --force-recreate', await getProjectDir(serverDir), null);
        break;
      }

      case 's-l': {
        await spawnCmd('go run main.go dev', await getProjectDir(serverDir), null);
        break;
      }

      case 'conf':
      case 'const':
      case 'da':
      case 'ls':
      case 'sod': {
        await spawnNPMCmd(
          `${npmRunR} ${inputCmd}`,
          await getProjectDir(libDevDir),
          processArgs.slice(1),
        );
        break;
      }

      case 'it': {
        const itArgs = processArgs.slice(1);
        await spawnNPMCmd(
          `${npmRunR} ${itArgs[0] || 'dev'}`,
          await getProjectDir(itDir),
          itArgs.slice(1),
        );
        break;
      }

      case 'migrate': {
        const arg1 = processArgs[1];
        checkArg(arg1, 'arg1');
        if (arg1 === 'drop') {
          await spawnCmd(`${migrateCmd} drop`, await getProjectDir(serverDir), null);
        } else if (arg1.startsWith('+') || arg1.startsWith('-')) {
          const num = parseInt(arg1.substr(1), 10);
          checkMigrationNumber(num);
          await spawnCmd(
            `${migrateCmd} ${arg1[0] === '+' ? 'up' : 'down'} ${num}`,
            await getProjectDir(serverDir),
            null,
          );
        } else {
          const num = parseInt(arg1, 10);
          checkMigrationNumber(num);
          await spawnCmd(`${migrateCmd} goto ${num}`, await getProjectDir(serverDir), null);
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
