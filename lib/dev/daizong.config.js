/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const buildCmd = 'tsc --incremental --tsBuildInfoFile build.tsbuildinfo';

export default {
  da: {
    run: ['#build', 'node --experimental-json-modules ./dist/mingru.js'],
  },
  lint: {
    run: 'eslint --max-warnings 0 --ext .ts .',
  },
  dev: {
    run: ['#clean', buildCmd + ' -w'],
  },
  build: {
    run: ['#clean', buildCmd],
  },
  clean: {
    run: {
      del: ['dist', 'dist_tests'],
    },
  },
};
