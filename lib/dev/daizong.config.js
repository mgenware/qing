/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

function runDistFile(file) {
  return ['#build', `node --experimental-json-modules ./dist/${file}.js`];
}

export default {
  da: {
    run: runDistFile('da'),
  },
  const: {
    run: runDistFile('constants/build'),
  },
  ls: {
    run: runDistFile('ls/build'),
  },
  lint: {
    run: 'eslint --max-warnings 0 --ext .ts .',
  },
  dev: {
    run: ['tsc -w'],
  },
  build: {
    run: ['tsc'],
  },
  clean: {
    run: {
      del: ['dist', 'dist_tests'],
    },
  },
};
