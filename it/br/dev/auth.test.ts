/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $ } from 'br';

test('__/auth', async ({ page }) => {
  const p = $(page);
  await p.goto('/__/auth', null);

  await p.$('h1:has-text("Auth")').shouldBeVisible();
  await p.$('h2:has-text("Default context")').shouldBeVisible();
  await p.$('#input-id').shouldHaveValue('');
});
