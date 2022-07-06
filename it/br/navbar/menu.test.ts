/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br';
import {
  navbarUserMenuSel,
  clickNavbarUserMenu,
  navbarThemeMenuSel,
  clickNavbarThemeMenu,
} from 'br/com/navbar/navbar';

const emptyContentID = '#br-copyright';

test('Navbar - Dismiss user menu', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  // Dismissed by Esc.
  await clickNavbarUserMenu(p);
  await p.$(navbarUserMenuSel).e.toBeVisible();
  await p.c.keyboard.down('Escape');
  await p.$(navbarUserMenuSel).e.not.toBeVisible();

  // Dismissed by clicks.
  await clickNavbarUserMenu(p);
  await p.$(navbarUserMenuSel).e.toBeVisible();
  await p.$(emptyContentID).click();
  await p.$(navbarUserMenuSel).e.not.toBeVisible();
});

test('Navbar - Dismiss theme menu', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  // Dismissed by Esc.
  await clickNavbarThemeMenu(p);
  await p.$(navbarThemeMenuSel).e.toBeVisible();
  await p.c.keyboard.down('Escape');
  await p.$(navbarThemeMenuSel).e.not.toBeVisible();

  // Dismissed by clicks.
  await clickNavbarThemeMenu(p);
  await p.$(navbarThemeMenuSel).e.toBeVisible();
  await p.$(emptyContentID).click();
  await p.$(navbarThemeMenuSel).e.not.toBeVisible();
});
