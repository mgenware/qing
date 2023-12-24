#!/usr/bin/env node

/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import errMsg from 'catch-err-msg';
import { parseArgs } from 'node:util';
import which from 'which';
import chalk from 'chalk';
import * as iou from './ioutil.js';
import * as sp from './spawn.js';

if (process.platform === 'win32') {
  console.error('Qing CLI does not support Windows, please use WSL2 on Windows.');
  process.exit(1);
}

function printUsage() {
  iou.print(`
    Usage
      $ qing <command> [command arguments]
    Command
      w                  Build, run and watch web files
      w-br               Build, run and watch web files for BR testing
      w-lint             Run linting process on web source
      s <options>        Build and start server in containers
      s-br <options>     Build and start server in containers (browser test mode)
      s-ut <options>     Build and start server in containers (unit test mode)
      s-f <options>      Build and start server in containers (force recreation)
      s-l <options>      Build and start server locally
      s-lint             Run linting process on server source
      conf               Build config files
      da                 Build data access layer
      ls                 Build localized strings
      sod <file>         Build SOD (Shared Object Definition)           
      it <config>           Run integration tests
        dev (default)      - Start development (default)
        all                - Run all integration tests
        api                - Run API tests
        br                 - Run browser (E2E) tests
      migrate <cmd>      Run database migrations
        +<N>               - Apply N up migrations
        -<N>               - Apply N down migrations
        <N>                - Migrate to version N
        drop               - Drop everything in database
      mail               Print dev mailbox directory
      doctor             Check if all required commands are available
      version            Print version information
      
  `);
}

const webDir = 'web';
const serverDir = 'server';
const libScriptDir = 'lib/script';
const itDir = 'it';
const helpText = 'Run `qing` for help.';

function checkArg(s: string | undefined, name: string): asserts s {
  if (!s) {
    throw new Error(`"${name}" is undefined. ${helpText}`);
  }
}

function checkMigrationNumber(num: number) {
  if (num < 1) {
    throw new Error(`Migration number must be greater than or equal to 1, got ${num}.`);
  }
}

async function checkCommandAvailable(cmd: string) {
  const resolved = await which(cmd);
  if (resolved) {
    console.log(`${cmd} is available.`);
  } else {
    console.log(chalk.red(`${cmd} is not available.`));
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const cli = parseArgs({
      options: {
        'app-config': {
          type: 'string',
        },
        'core-config': {
          type: 'string',
        },
      },
      allowPositionals: true,
    });

    const inputCmd = cli.positionals[0];

    if (!inputCmd) {
      printUsage();
      process.exit(0);
    }

    // Returns default params for `s` command.
    function getSArgs() {
      const appConfig = cli.values['app-config'] ?? 'local';
      if (!appConfig) {
        throw new Error('Missing app config name.');
      }
      return {
        coreConfigName: cli.values['core-config'] ?? 'default_core',
        appConfigName: appConfig,
      };
    }

    switch (inputCmd) {
      case 'version': {
        iou.print(await iou.getVersion());
        break;
      }

      case 'w': {
        await sp.spawnDZCmd({
          cmd: 'd',
          args: null,
          daizongDir: await iou.getProjectDir(webDir),
        });
        break;
      }

      case 'w-br': {
        await sp.spawnDZCmd({ cmd: 'br', args: null, daizongDir: await iou.getProjectDir(webDir) });
        break;
      }

      case 'w-lint': {
        await sp.spawnDZCmd({
          cmd: 'lint',
          args: null,
          daizongDir: await iou.getProjectDir(webDir),
        });
        break;
      }

      case 's': {
        await sp.spawnDockerComposeCmd({
          args: ['up'],
          dir: await iou.getProjectDir(serverDir),
          ...getSArgs(),
        });
        break;
      }

      case 's-br': {
        await sp.spawnDockerComposeCmd({
          args: ['up'],
          dir: await iou.getProjectDir(serverDir),
          ...getSArgs(),
          env: { QING_BR: '1' },
        });
        break;
      }

      case 's-ut': {
        const arg1 = cli.positionals[1];
        await sp.spawnDockerComposeCmd({
          args: ['exec', '-e', 'QING_UT=1', 'server', 'go', 'test', arg1 ?? './...'],
          dir: await iou.getProjectDir(serverDir),
          ...getSArgs(),
        });
        break;
      }

      case 's-f': {
        await sp.spawnDockerComposeCmd({
          args: ['up', '--force-recreate'],
          dir: await iou.getProjectDir(serverDir),
          ...getSArgs(),
        });
        break;
      }

      case 's-l': {
        await iou.pipedSpawn('go', {
          args: ['run', 'main.go', 'dev'],
          workingDir: await iou.getProjectDir(serverDir),
        });
        break;
      }

      case 's-lint': {
        await iou.pipedSpawn('golangci-lint', {
          args: ['run'],
          workingDir: await iou.getProjectDir(serverDir),
        });
        break;
      }

      case 'conf':
      case 'da':
      case 'ls':
      case 'sod': {
        await sp.spawnDZCmd({
          cmd: inputCmd,
          args: cli.positionals.slice(1),
          daizongDir: await iou.getProjectDir(libScriptDir),
        });
        break;
      }

      case 'it': {
        const itArgs = cli.positionals.slice(1);
        await sp.spawnDZCmd({
          cmd: itArgs[0] || 'dev',
          args: itArgs.slice(1),
          daizongDir: await iou.getProjectDir(itDir),
        });
        break;
      }

      case 'doctor': {
        const neededCmds = ['docker', 'dz', 'pnpm', 'go', 'golangci-lint'];
        for (const cmd of neededCmds) {
          await checkCommandAvailable(cmd);
        }
        console.log(chalk.green('All required commands are available.'));
        break;
      }

      case 'migrate': {
        const arg1 = cli.positionals[1];
        checkArg(arg1, 'arg1');
        if (arg1 === 'drop') {
          await sp.spawnDockerComposeMigrate({
            args: ['drop'],
            dir: await iou.getProjectDir(serverDir),
            ...getSArgs(),
          });
        } else if (arg1.startsWith('+') || arg1.startsWith('-')) {
          const num = parseInt(arg1.substr(1), 10);
          checkMigrationNumber(num);
          await sp.spawnDockerComposeMigrate({
            args: [arg1[0] === '+' ? 'up' : 'down', num.toString()],
            dir: await iou.getProjectDir(serverDir),
            ...getSArgs(),
          });
        } else {
          const num = parseInt(arg1, 10);
          checkMigrationNumber(num);
          await sp.spawnDockerComposeMigrate({
            args: ['goto', num.toString()],
            dir: await iou.getProjectDir(serverDir),
            ...getSArgs(),
          });
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
