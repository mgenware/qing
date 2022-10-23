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
  await nbc.checkUserNavbar(p, usr.user);
  // Keep login status after reloading.
  await p.reload();
  await nbc.checkUserNavbar(p, usr.user);

  // `checkUserNavbar` only checks top-level navbar items,
  // we need to check user menu items here.
  const userMenu = p.$(nbm.navbarSel).$('.user-group .dropdown');

  await nbm.userMenuBtn(p).click();
  await userMenu.$a({ href: `/u/${usr.user.id}`, text: 'Profile' }).e.toBeVisible();
  await userMenu.$a({ href: '/m/your-posts', text: 'Your posts' }).e.toBeVisible();
  await userMenu.$a({ href: '/m/your-fposts', text: 'Your forum posts' }).e.toBeVisible();
  await userMenu.$a({ href: '/m/settings/profile', text: 'Settings' }).e.toBeVisible();
  // TODO: tests for new post and new thread.
});

test('Navbar - Sign out', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  const userBtn = nbm.userMenuBtn(p);
  await userBtn.click();
  await userBtn.$aButton('Sign out').click();
  await nbc.checkVisitorNavbar(p);
});
