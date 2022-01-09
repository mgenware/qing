/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import urlTree from 'fx214';

export const serverURL = 'http://localhost:8000';

const urls = urlTree(
  {
    __: {
      // Prevent `underscoresToHyphens` from convert the root `__` to `--`.
      __content__: '__',
      auth: {
        // The GET route for user login used in BR tests.
        in: '',
        out: '',
      },
      api: {
        auth: {
          new: '',
          in: '',
          info: '',
          del: '',
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

const r = urls.__;
export const { api } = r;
export const { auth } = r;
