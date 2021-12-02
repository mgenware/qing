/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import urlTree from 'fx214';

export const serverURL = 'http://localhost:8000';

// Intentional copy of `devRoutes.ts` as it needs to be used in this separate project.
export const devAPIs = urlTree(
  {
    __: {
      // Prevent `underscoresToHyphens` from convert the root `__` to `--`.
      __content__: '__',
      elements: '',
      auth: '',
      api: {
        auth: {
          new: '',
          in: '',
          info: '',
        },
      },
    },
  },
  { underscoresToHyphens: true },
);
