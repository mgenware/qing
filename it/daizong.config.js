/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export default {
  lint: {
    run: 'eslint --max-warnings 0 --ext .ts .',
  },
  dev: {
    // Not a typo. We use `ttsc` instead of `tsc` to transform imports.
    run: 'ttsc -p . -w',
    before: {
      del: 'dist',
    },
  },
  build: {
    // Not a typo. We use `ttsc` instead of `tsc` to transform imports.
    run: 'ttsc -p .',
  },
  api: {
    run: 'node -r source-map-support/register dist/api/run.js',
  },
  br: {
    run: 'node -r source-map-support/register dist/br/run.js',
  },
  all: {
    run: ['#api', '#br'],
  },
};
