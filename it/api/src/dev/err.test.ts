/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itaResultRaw } from '../../api.js';
import * as errRoutes from '@qing/routes/dev/err.js';

// ----- NOTE: this file only tests error APIs. Page errors are tested in BR tests. -----

itaResultRaw('`panicErrAPI`', errRoutes.panicErrAPI, null, null, {
  c: 1,
  m: 'test error',
});

itaResultRaw('`panicObjAPI`', errRoutes.panicObjAPI, null, null, { c: 1, m: '-32' });

itaResultRaw('`failAPI`', errRoutes.failAPI, null, null, { c: 1, m: 'test error' });
