/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itaResultRaw } from 'api';
import * as errRoutes from '@qing/routes/d/dev/err';

// ----- NOTE: this file only tests error APIs. Page errors are tested in BR tests. -----

itaResultRaw('`panicErrAPI`', errRoutes.panicErrAPI, null, null, {
  code: 1,
  msg: 'test error',
});

itaResultRaw('`panicObjAPI`', errRoutes.panicObjAPI, null, null, { code: 1, msg: '-32' });

itaResultRaw('`failAPI`', errRoutes.failAPI, null, null, { code: 1, msg: 'test error' });
