/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $ } from 'br';
import errRoutes from '@qing/routes/d/dev/err';
import { expect } from '@playwright/test';

test(`Error page - ${errRoutes.panicServer}`, async ({ page }) => {
  const p = $(page);
  const resp = await p.goto(errRoutes.panicServer, null);
  expect(resp?.status()).toBe(500);
  // TODO: Check page content.
});
