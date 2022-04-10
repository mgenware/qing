/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const brCmd = 'npx playwright test --browser=chromium --config=pw.config.cjs';

export default {
  lint: 'eslint --max-warnings 0 --ext .ts .',
  dev: {
    alias: 'd',
    run: 'tsc -p . -w',
    before: {
      del: 'dist',
    },
  },
  build: 'tsc -p .',
  api: 'mocha --parallel --require source-map-support/register --reporter dot dist/api/**/*.test.js',
  br: {
    run: brCmd,
    t: {
      run: brCmd + ' --debug',
    },
  },
  all: ['#api', '#br'],
};
