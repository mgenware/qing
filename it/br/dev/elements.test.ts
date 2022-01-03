/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $ } from 'br';

test('__/elements', async ({ page }) => {
  const p = $(page);
  await p.goto('/__/elements', null);

  // Do a brief check on elements page.
  await p.$('h1:has-text("Colors")').shouldBeVisible();
  await p.$('h2:has-text("Default context")').shouldBeVisible();
});
