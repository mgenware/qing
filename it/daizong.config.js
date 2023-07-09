/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const brCmd = 'npx playwright test --project=chromium';

export default {
  lint: 'eslint --max-warnings 0 --ext .ts .',
  compile: {
    run: 'tsc --incremental -project ./tsconfig.api.json',
  },
  clean: {
    run: {
      del: 'dist',
    },
  },
  api: {
    before: '#compile',
    run: 'mocha --parallel --require source-map-support/register "dist/api/**/*.test.js"',
  },
  br: brCmd,
  brt: `${brCmd} --debug`,
  brg: `${brCmd} -g`,
  brtg: `${brCmd} --debug -g`,

  all: ['#api', '#br'],
};
