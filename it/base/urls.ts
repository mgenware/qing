/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import urlTree from 'fx214';

export const serverURL = 'http://localhost:8000';

const devRoutes = urlTree(
  {
    __: {
      // Prevent `underscoresToHyphens` from convert the root `__` to `--`.
      __content__: '__',
      api: {
        auth: {
          new: '',
          in: '',
          info: '',
          del: '',
          // The GET version of `in`.
          in_get: '',
        },
        user: {
          post_count: '',
          question_count: '',
          answer_count: '',
          discussion_count: '',
        },
        compose: {
          set_debug_time: '',
        },
      },
    },
  },
  { underscoresToHyphens: true },
);

export default devRoutes.__.api;
