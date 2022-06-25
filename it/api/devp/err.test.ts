/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita } from 'api';
import * as errRoutes from '@qing/routes/d/dev/err';
import * as assert from 'node:assert';

// ----- NOTE: this file only tests error APIs. Page errors are tested in BR tests. -----

ita(
  '`panicErrAPI`',
  errRoutes.panicErrAPI,
  null,
  null,
  (r) => {
    assert.deepStrictEqual(r, { code: 10000, msg: 'test error' });
  },
  { ignoreAPIError: true },
);

ita(
  '`panicObjAPI`',
  errRoutes.panicObjAPI,
  null,
  null,
  (r) => {
    assert.deepStrictEqual(r, { code: 10000, msg: '-32' });
  },
  { ignoreAPIError: true },
);
