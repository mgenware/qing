/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { run } from '../runner.js';
import { closeBrowser, launchBrowser } from './browser.js';

(async () => {
  await launchBrowser();
  await run('BR tests', (s) => import(s));
  await closeBrowser();
})();
