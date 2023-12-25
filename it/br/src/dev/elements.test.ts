/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { $ } from 'br.js';
import { elements } from '@qing/routes/dev/root.js';
import { test, expect } from '@playwright/test';

test('__/elements', async ({ page }) => {
  const p = $(page);
  await p.goto(elements, null);

  // Do a brief check on elements page.
  await expect(p.body.$hasText('h1', 'Colors').c).toBeVisible();
  await expect(p.body.$hasText('h2', 'Default context').c).toBeVisible();
});
