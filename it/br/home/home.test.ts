/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, expect, $ } from 'br.js';

test('Home page', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  const c = await p.c.content();
  expect(c.length).toBeTruthy();
});
