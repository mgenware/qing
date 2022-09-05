/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, alternativeLocaleBlock } from 'br';
import { newUser } from 'helper/user';
import * as cm from './common';

alternativeLocaleBlock(() => {
  test('Index route - BR lang', async ({ page }) => {
    const p = $(page);
    await p.goto('/', null);
    await cm.checkPageLocale(p, 1);
  });
});

test('Index route - User lang', async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await p.goto('/', u);
      await cm.checkPageLocale(p, 1);
    },
    { alternativeLocale: true },
  );
});

test('Index route - 404', async ({ page }) => {
  const p = $(page);
  const resp = await p.goto('/__404__', null);
  await cm.check404(p, resp);
});
