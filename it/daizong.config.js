/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const brCmd = 'npx playwright test --project=chromium -c dist';

export default {
  lint: 'eslint --max-warnings 0 --ext .ts .',
  dev: {
    alias: 'd',
    run: 'tsc --incremental -p . -w',
  },
  build: {
    run: 'tsc -p .',
    before: {
      del: 'dist',
    },
  },
  clean: {
    run: {
      del: 'dist',
    },
  },
  api: 'mocha --parallel --require source-map-support/register "dist/api/**/*.test.js"',
  br: brCmd,
  brt: `${brCmd} --debug`,
  brg: `${brCmd} -g`,
  brtg: `${brCmd} --debug -g`,

  all: ['#api', '#br'],
};
