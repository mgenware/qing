/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br.js';
import * as nb from 'br/com/navbar/menu.js';

const emptyContentID = '#br-copyright';

test('Navbar - Dismiss user menu', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  // Dismissed by Esc.
  await nb.userMenuBtn(p).click();
  const menuEl = nb.userMenuEl(p);
  await menuEl.e.toBeVisible();
  await p.c.keyboard.down('Escape');
  await menuEl.e.not.toBeVisible();

  // Dismissed by clicks.
  await nb.userMenuBtn(p).click();
  await menuEl.e.toBeVisible();
  await p.$(emptyContentID).click();
  await menuEl.e.not.toBeVisible();
});

test('Navbar - Dismiss theme menu', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  // Dismissed by Esc.
  await nb.themeMenuBtn(p).click();
  const menuEl = nb.themeMenuEl(p);
  await menuEl.e.toBeVisible();
  await p.c.keyboard.down('Escape');
  await menuEl.e.not.toBeVisible();

  // Dismissed by clicks.
  await nb.themeMenuBtn(p).click();
  await menuEl.e.toBeVisible();
  await p.$(emptyContentID).click();
  await menuEl.e.not.toBeVisible();
});
