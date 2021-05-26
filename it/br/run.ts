/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { run } from 'base/runner';
import { disposeBrowser, launchBrowser } from 'base/browserInstance';

(async () => {
  await launchBrowser();
  await run('BR tests', 'br', (s) => import(s));
  await disposeBrowser();
})();
