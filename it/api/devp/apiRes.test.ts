/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, expect } from 'api';
import * as apiRes from '@qing/routes/d/dev/api/apiResult';

ita('Success', apiRes.success, null, null, (r) => {
  expect(r).toEqual({
    d: {
      One: 1,
      String: 'str',
      Zero: 0,
    },
  });
});

ita(
  'Error',
  apiRes.error,
  null,
  null,
  (r) => {
    expect(r).toEqual({ code: 1, message: 'API error for testing' });
  },
  { ignoreAPIError: true },
);

ita(
  'Panic',
  apiRes.success,
  null,
  null,
  (r) => {
    expect(r).toEqual({ code: 1, message: 'API error for testing' });
  },
  { ignoreAPIError: true },
);
