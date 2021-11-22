/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import buildTree from 'fx214';

const routes = buildTree(
  {
    __: {
      // Prevent `underscoresToHyphens` from convert the root `__` to `--`.
      __content__: '__',
      elements: '',
      authRoot: '',
      // GET routes used in auth page.
      auth: {
        new: '',
        in: '',
        info: '',
      },
    },
  },
  { underscoresToHyphens: true },
);

export default routes.__;
