/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const turboBuildCmd = 'ttsc -p ./tsconfig-turbo.json';
const utCmd = 'web-test-runner "./dist/**/*.test.js" --node-resolve';
const devEnv = {
  NODE_ENV: 'development',
};
const prodEnv = {
  NODE_ENV: 'production',
};
const prebuildDirName = 'prebuild';

function getPrebuildTask(name) {
  return `node ./${prebuildDirName}/dist/${name}.js`;
}

const prebuildTasks = ['build-shared-const'].map(getPrebuildTask);

module.exports = {
  lint: {
    run: ['eslint --max-warnings 0 --ext .ts src/', 'lit-analyzer "src/**/*.ts"'],
  },

  /** Standard mode */
  dev: {
    run: ['#prepare', 'rollup -c -w'],
    env: devEnv,
  },
  build: {
    run: ['#lint', '#prepare', 'rollup -c'],
    env: prodEnv,
  },

  /** Turbo mode */
  turbo: {
    // Use `ttsc` instead of `tsc` to enable path rewriting.
    run: ['#prepare-turbo', turboBuildCmd + ' -w'],
    env: devEnv,
  },
  'turbo-build': {
    run: ['#prepare-turbo', turboBuildCmd],
    env: prodEnv,
  },

  /** UT */
  ut: {
    t: {
      run: utCmd,
    },
    tw: {
      run: utCmd + ' --watch',
    },
    run: ['#turbo-build', '#ut t'],
  },

  /** Prebuild */
  prebuild: {
    build: {
      run: `tsc -p ./${prebuildDirName}`,
    },
    runTasks: {
      run: prebuildTasks,
      parallel: true,
    },
    run: ['#prebuild build', '#prebuild runTasks'],
  },

  'build-langs': {
    alias: 'l',
    run: ['#prebuild build', getPrebuildTask('build-ls')],
  },

  _: {
    privateTasks: {
      prepare: {
        run: '#prebuild',
      },
      'prepare-turbo': {
        run: '#prebuild',
        before: {
          del: 'dist',
        },
      },
    },
  },
};
