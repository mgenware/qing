/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br.js';
import * as nbm from 'br/cm/navbar/menu.js';
import * as nbc from 'br/cm/navbar/checks.js';

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
  const userMenu = nbm.userDropdownBtn(p);

  await nbm.userDropdownBtn(p).click();
  await userMenu.$a({ href: `/u/${usr.user.id}`, text: 'Profile' }).e.toBeVisible();
  await userMenu.$a({ href: '/m/your-posts', text: 'Your posts' }).e.toBeVisible();
  await userMenu.$a({ href: '/m/settings/profile', text: 'Settings' }).e.toBeVisible();
  // Non-link items like "New post" are tested in their own test files.
});

test('Navbar - Sign out', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  const userBtn = nbm.userDropdownBtn(p);
  await userBtn.click();
  await userBtn.$aButton('Sign out').click();
  await nbc.checkVisitorNavbar(p);
});
