/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita } from 'api';
import * as apiRes from '@qing/routes/d/dev/api/apiResult';
import * as assert from 'node:assert';

ita('Success', apiRes.success, null, null, (r) => {
  assert.deepStrictEqual(r, {
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
    assert.deepStrictEqual(r, { code: 1, msg: 'API error for testing' });
  },
  { ignoreAPIError: true },
);

ita(
  'Panic',
  apiRes.panic,
  null,
  null,
  (r) => {
    assert.deepStrictEqual(r, { code: 10000, msg: 'API panic error for testing' });
  },
  { ignoreAPIError: true },
);
