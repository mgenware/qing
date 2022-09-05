/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const turboBuildCmd = 'tsc -p ./tsconfig-turbo.json';
const utCmd = 'wtr "./dist-turbo/**/*.test.js" --node-resolve --playwright --browsers chromium';
const devEnv = {
  NODE_ENV: 'development',
};
const prodEnv = {
  NODE_ENV: 'production',
};

const tscw = 'tsc -w';

function buildTS(config) {
  return `node "b-ts.${config}.js"`;
}

function buildCSS(config) {
  return `node "b-css.${config}.js"`;
}

function devTask(config, alias) {
  return {
    alias: alias,
    before: ['#clean', 'tsc'],
    run: [tscw, buildTS(config), buildCSS('dev')],
    parallel: true,
    env: devEnv,
  };
}

export default {
  lint: {
    ts: 'eslint --max-warnings 0 --ext .ts src/',
    lit: 'lit-analyzer "src/**/*.ts"',
    html: 'html-validate "../userland/templates/**/*.html"',
    run: ['#lint-ts', '#lint-html', '#lint-lit'],
  },

  /** Standard mode */
  dev: devTask('dev'),
  br: devTask('br'),

  /** Turbo mode */
  turbo: {
    run: ['#clean', turboBuildCmd + ' -w'],
    env: devEnv,
  },
  'turbo-build': {
    run: ['#clean', turboBuildCmd],
    env: prodEnv,
  },

  /** UT */
  ut: {
    t: utCmd,
    tw: utCmd + ' --watch',
    run: ['#turbo-build', '#ut-t'],
  },

  clean: {
    run: ['#prepare', '#prepare_turbo'],
    parallel: true,
  },

  _: {
    privateTasks: {
      prepare: {
        run: {
          del: ['dist', '../userland/static/d/js', 'tsconfig.tsbuildinfo'],
        },
      },
      prepare_turbo: {
        run: {
          del: ['dist-turbo', 'tsconfig-turbo.tsbuildinfo'],
        },
      },
    },
  },
};
