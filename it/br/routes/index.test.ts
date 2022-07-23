/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $ } from 'br';
import * as cm from './common';

test.use({ locale: cm.newLang });

test('Index route - BR lang', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await cm.checkNewLang(p);
});
