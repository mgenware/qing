/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br';
import * as nbm from 'br/com/navbar/menu';
import * as nbc from 'br/com/navbar/checks';

test('Navbar - Visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nbc.checkVisitorNavbar(p);
});

test('Navbar - User', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await nbc.checkUserNavbar(p, { user: usr.user, sideNav: false });
  // Keep login status after reloading.
  await p.reload();
  await nbc.checkUserNavbar(p, { user: usr.user, sideNav: false });
});

test('Navbar - Logout', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  const userBtn = nbm.userMenuBtn(p);
  await userBtn.click();
  await userBtn.$aButton('Sign out').click();
  await nbc.checkVisitorNavbar(p);
});
