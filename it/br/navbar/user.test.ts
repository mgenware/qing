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
} from 'br/com/content/userView';
import { navBarID } from './common';

test('Navbar - visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await p.$(`${navBarID} > .dropdown`).shouldNotExist();
});

test('Navbar - user', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await navbarUserViewShouldAppear(p, usr.user);
});

test('Navbar - logout', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.$(navbarUserMenuSel).$aButton('Sign out').click();
  await navbarUserViewShouldNotAppear(p);
});
