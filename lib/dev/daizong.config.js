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
  da: runDistFile('da/mingru'),
  ls: runDistFile('ls/build'),
  conf: runDistFile('conf/build'),
  sod: runDistFile('sod/build'),
  lint: 'eslint --max-warnings 0 --ext .ts .',
  dev: {
    alias: 'd',
    run: 'tsc -w',
  },
  build: 'tsc',
  clean: {
    run: {
      del: ['dist', 'dist_tests'],
    },
  },
};
