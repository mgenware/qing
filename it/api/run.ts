/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { run } from 'base/runner';

(async () => {
  await run('API tests', (s) => import(s));
})();
