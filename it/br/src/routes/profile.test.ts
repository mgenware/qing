/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { $, usr } from 'br.js';
import { test } from '@playwright/test';
import { newUser } from '@qing/dev/it/helper/user.js';
import * as cm from './common.js';
import { alternativeLocale } from '@qing/dev/it/base/def.js';

test.describe('Alternative locale block', () => {
  test.use({ locale: alternativeLocale });
  test('Profile route - BR lang', async ({ page }) => {
    const p = $(page);
    await p.goto(usr.user.link, null);
    await cm.checkPageLocale(p, 1);
  });
});

test('Profile route - User lang', async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await p.goto(usr.user.link, u);
      await cm.checkPageLocale(p, 1);
    },
    { alternativeLocale: true },
  );
});

test('Profile route - 404', async ({ page }) => {
  const p = $(page);
  // TODO: migrate to @qing/routes when node16 issue is fixed.
  const resp = await p.goto('/u/__404__', null);
  await cm.check404(p, resp);
});
