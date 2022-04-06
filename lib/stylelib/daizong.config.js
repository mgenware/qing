/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export default {
  build: {
    alias: 'b',
    run: [
      'concat -o dist/stylelib.css node_modules/modern-normalize/modern-normalize.css node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
      'cleancss -o dist/main.min.css dist/stylelib.css',
      'node jsfy.js',
    ],
    before: {
      mkdirDel: 'dist',
    },
    after: {
      del: 'dist/stylelib.css',
    },
  },
};
