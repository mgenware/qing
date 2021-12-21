/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br';

test('View __/auth', async ({ page, goto }) => {
  await goto('/__/auth', null);

  await page.$('h1:has-text("Auth")').shouldBeVisible();
  await page.$('h2:has-text("Default context")').shouldBeVisible();
  await page.$('#input-id').shouldHaveValue('');
});
