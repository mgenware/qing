/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from '@playwright/test';
import { $, usr } from 'br.js';
import * as nb from 'cm/navbar/checks.js';

test('`br.BRPage` has no users logged in', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nb.checkVisitorNavbar(p);
});

test('`br.BRPage.signIn`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await nb.checkUserNavbar(p, usr.user);
});

test('`br.BRPage.reload()`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reload();
  await nb.checkUserNavbar(p, usr.user);
});

test('`br.BRPage.reload` called with a different user', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reloadWithUser(usr.user2);
  await nb.checkUserNavbar(p, usr.user2);
});

test('`br.BRPage.reload` called to sign out', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reloadWithUser(null);
  await nb.checkVisitorNavbar(p);
});

test('`br.BRPage.signOut`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.signOut();
  await nb.checkVisitorNavbar(p);
});
