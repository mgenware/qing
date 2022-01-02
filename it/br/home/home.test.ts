/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, expect } from 'br';

test('Home page', async (page) => {
  await page.goto('/', null);
  const c = await page.c.content();
  expect(c.length).toBeTruthy();
});
