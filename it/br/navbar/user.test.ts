/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br';
import {
  navbarUserViewShouldNotAppear,
  navbarUserViewShouldAppear,
  navbarUserMenuSel,
  clickNavbarUserMenu,
} from 'br/com/navbar/navbar';

test('Navbar - visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await navbarUserViewShouldNotAppear(p);
});

test('Navbar - user', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await navbarUserViewShouldAppear(p, usr.user);
});

test('Navbar - logout', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await clickNavbarUserMenu(p);
  await p.$(navbarUserMenuSel).$aButton('Sign out').click();
  await navbarUserViewShouldNotAppear(p);
});
