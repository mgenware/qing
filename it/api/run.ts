/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { startRunner } from 'base/runner';

(async () => {
  await startRunner('API tests', 'api', (s) => import(s));
})();
