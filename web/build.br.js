/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import build from './build.base.js';

build({
  env: {
    'window.__qing_br__': true,
  },
});
