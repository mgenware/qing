#!/usr/bin/env node

/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { readFile } from 'fs/promises';
import nodepath from 'path';
import { fileURLToPath } from 'url';
import errMsg from 'catch-err-msg';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

if (process.platform === 'win32') {
  console.error('qing-dev does not support Windows');
  process.exit(1);
}

const dirPath = nodepath.dirname(fileURLToPath(import.meta.url));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = JSON.parse(await readFile(nodepath.join(dirPath, '../package.json'), 'utf8'));

const args = process.argv.slice(2);

function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

function printUsage() {
  // eslint-disable-next-line no-console
  console.log(`
    Usage
      $ ${pkg.name} <command> [command arguments]
    Command
      w          Start web dev
      s          Start server dev in containers
      s_l        Start server dev in local environment
      d <name>   Run scripts in '/lib/dev'
        const      - Rebuild shared constants
        da         - Rebuild data access layer
        ls         - Rebuild localized strings

      rootdir    Print project root directory
      help       Print help information
      version    Print version information
      
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
  return nodepath.join(await getRootDir(), name);
}

function checkArg(s: string | undefined, name: string): asserts s {
  if (!s) {
    throw new Error(`"${name}" is undefined`);
  }
}

export default async function spawnCmd(cmd: string, cwd?: string): Promise<void> {
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    switch (inputCmd) {
      case 'help':
        printUsage();
        break;

      case 'version':
        print(pkg.version);
        break;

      case 'rootdir':
        print(await getRootDir());
        break;

      case 'w':
        await spawnCmd('npm run r dev', await getProjectDir(webDir));
        break;

      case 's':
        await spawnCmd('docker-compose up', await getProjectDir(serverDir));
        break;

      case 's_l':
        await spawnCmd('go run main.go dev', await getProjectDir(serverDir));
        break;

      case 'd':
        checkArg(arg1, 'arg1');
        await spawnCmd(`npm run r ${arg1}`, await getProjectDir(libDev));
        break;

      default:
        throw new Error(`Unknown command "${inputCmd}"`);
    }
  } catch (err) {
    console.error(`Error: ${errMsg(err)}`);
    process.exit(1);
  }
})();
