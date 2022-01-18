#!/usr/bin/env node

/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import errMsg from 'catch-err-msg';
import * as iou from './ioutil.js';
import * as sp from './spawn.js';

if (process.platform === 'win32') {
  console.error('Qing CLI does not support Windows, please use WSL2 on Windows.');
  process.exit(1);
}

const processArgs = process.argv.slice(2);

function printUsage() {
  iou.print(`
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
        iou.print(await iou.getVersion());
        break;
      }

      case 'rootdir': {
        iou.print(await iou.getRootDir());
        break;
      }

      case 'w':
      case 'f': {
        await sp.spawnDZCmd('dev', null, await iou.getProjectDir(webDir));
        break;
      }

      case 's':
      case 'b': {
        await sp.spawnDockerComposeCmd(['up'], await iou.getProjectDir(serverDir));
        break;
      }

      case 's-f': {
        await sp.spawnDockerComposeCmd(
          ['up', '--force-recreate'],
          await iou.getProjectDir(serverDir),
        );
        break;
      }

      case 's-l': {
        await iou.pipedSpawn('go', ['run', 'main.go', 'dev'], await iou.getProjectDir(serverDir));
        break;
      }

      case 'conf':
      case 'const':
      case 'da':
      case 'ls':
      case 'sod': {
        await sp.spawnDZCmd(inputCmd, processArgs.slice(1), await iou.getProjectDir(libDevDir));
        break;
      }

      case 'it': {
        const itArgs = processArgs.slice(1);
        await sp.spawnDZCmd(itArgs[0] || 'dev', itArgs.slice(1), await iou.getProjectDir(itDir));
        break;
      }

      case 'migrate': {
        const arg1 = processArgs[1];
        iou.checkArg(arg1, 'arg1');
        if (arg1 === 'drop') {
          await sp.spawnDockerComposeMigrate(['drop'], await iou.getProjectDir(serverDir));
        } else if (arg1.startsWith('+') || arg1.startsWith('-')) {
          const num = parseInt(arg1.substr(1), 10);
          checkMigrationNumber(num);
          await sp.spawnDockerComposeMigrate(
            [arg1[0] === '+' ? 'up' : 'down', num.toString()],
            await iou.getProjectDir(serverDir),
          );
        } else {
          const num = parseInt(arg1, 10);
          checkMigrationNumber(num);
          await sp.spawnDockerComposeMigrate(
            ['goto', num.toString()],
            await iou.getProjectDir(serverDir),
          );
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
