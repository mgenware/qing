/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, expect } from '@playwright/test';
import { usr, $ } from 'br.js';
import * as nb from 'cm/navbar/menu.js';

const emptyContentID = '#br-copyright';

test('Navbar - Dismiss user menu', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  // Dismissed by Esc.
  await nb.userDropdownBtn(p).click();
  const menuEl = nb.userDropdownMenu(p);
  await expect(menuEl.c).toBeVisible();
  await p.c.keyboard.down('Escape');
  await expect(menuEl.c).not.toBeVisible();

  // Dismissed by clicks.
  await nb.userDropdownBtn(p).click();
  await expect(menuEl.c).toBeVisible();
  await p.$(emptyContentID).click();
  await expect(menuEl.c).not.toBeVisible();
});

test('Navbar - Dismiss theme menu', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  // Dismissed by Esc.
  await nb.themeDropdownBtn(p).click();
  const menuEl = nb.themeDropdownMenu(p);
  await expect(menuEl.c).toBeVisible();
  await p.c.keyboard.down('Escape');
  await expect(menuEl.c).not.toBeVisible();

  // Dismissed by clicks.
  await nb.themeDropdownBtn(p).click();
  await expect(menuEl.c).toBeVisible();
  await p.$(emptyContentID).click();
  await expect(menuEl.c).not.toBeVisible();
});
