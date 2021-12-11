/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const turboBuildCmd = 'tsc -p ./tsconfig-turbo.json';
const utCmd = 'web-test-runner "./dist/**/*.test.js" --node-resolve';
const devEnv = {
  NODE_ENV: 'development',
};
const prodEnv = {
  NODE_ENV: 'production',
};

export default {
  lint: {
    ts: {
      run: 'eslint --max-warnings 0 --ext .ts src/',
    },
    lit: {
      run: 'lit-analyzer "src/**/*.ts"',
    },
    html: {
      run: 'html-validate "../userland/templates/**/*.html"',
    },
    run: ['#lint-ts', '#lint-html', '#lint-lit'],
  },

  /** Standard mode */
  dev: {
    run: ['#prepare', 'tsc-watch --onSuccess "node esbuild.cjs"'],
    env: devEnv,
  },
  build: {
    run: ['#lint', '#prepare', 'rollup -c'],
    env: prodEnv,
  },

  /** Turbo mode */
  turbo: {
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
    run: ['#turbo-build', '#ut-t'],
  },

  _: {
    privateTasks: {
      prepare: {
        run: {
          del: ['dist', '../userland/static/d/js'],
        },
      },
      'prepare-turbo': {
        run: {
          del: 'dist-turbo',
        },
      },
    },
  },
};
