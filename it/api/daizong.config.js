/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export default {
  dev: {
    alias: 'd',
    run: ['#clean', 'tsc -b src -w --preserveWatchOutput'],
    envGroups: ['development'],
  },

  build: {
    run: ['#clean', 'tsc -b src', '#lint'],
    envGroups: ['production'],
  },

  clean: {
    run: {
      del: ['dist'],
    },
  },

  lint: 'eslint --max-warnings 0 --ext .ts src/',

  _: {
    envGroups: {
      production: {
        NODE_ENV: 'production',
      },
      development: {
        NODE_ENV: 'development',
      },
    },
  },
};
