/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const brCmd = 'npx playwright test --project=webkit --config="pw.config.ts"';

export default {
  lint: 'eslint --max-warnings 0 --ext .ts .',
  dev: {
    run: 'tsc -p . -w',
    before: {
      del: 'dist',
    },
  },
  build: 'tsc -p .',
  api: 'node -r source-map-support/register dist/api/run.js',
  br: {
    run: brCmd,
    t: {
      run: brCmd,
      env: {
        PWDEBUG: 1,
      },
    },
  },
  all: ['#api', '#br'],
};
