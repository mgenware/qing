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
    run: 'ttsc -p . -w',
    before: {
      del: 'dist',
    },
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
