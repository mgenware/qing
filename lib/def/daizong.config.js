/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export default {
  build: {
    run: ['#clean', 'node ./build.js'],
  },

  clean: {
    run: {
      del: ['g'],
    },
  },
};
