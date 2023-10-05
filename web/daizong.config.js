/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const turboBuildCmd = 'tsc -p ./tsconfig-turbo.json';
const utCmd = 'wtr "./dist-turbo/**/*.test.js" --node-resolve --playwright --browsers chromium';
const tsc = 'tsc';
const tscW = `${tsc} -w --preserveWatchOutput`;
const devEnv = {
  NODE_ENV: 'development',
};
const prodEnv = {
  NODE_ENV: 'production',
};

function buildTS(config, watch) {
  return `node "esb.js" ${config}${watch ? ' -w' : ''}`;
}

function devTask(e) {
  const run = [];
  if (e.watch) {
    run.push(tscW);
  }
  run.push(buildTS(e.config, e.watch));
  return {
    before: ['#clean', 'tsc'],
    run,
    parallel: true,
    env: devEnv,
  };
}

export default {
  lint: {
    ts: 'eslint --max-warnings 0 --ext .ts src/',
    lit: 'lit-analyzer "src/**/*.ts"',
    html: 'html-validate "../userland/templates/**/*.html"',
    run: ['#lint-ts', '#lint-lit', '#lint-html'],
  },

  /** Standard mode */
  d: devTask({ config: 'dev', watch: true }),
  b: devTask({ config: 'prod', watch: false }),
  br: devTask({ config: 'br', watch: true }),

  /** Turbo mode */
  turbo: {
    run: ['#clean', turboBuildCmd + ' -w --preserveWatchOutput'],
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
    run: {
      del: ['../userland/static/g', 'tsconfig.tsbuildinfo'],
    },
  },
};
