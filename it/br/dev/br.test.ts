/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr } from 'br';
import * as nb from 'br/com/navbar/checks';

test('`br.page` has no users logged in', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nb.checkVisitorNavbar(p);
});

test('`br.page.signIn`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await nb.checkUserNavbar(p, usr.user2);
});

test('`br.page.reload()`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reload();
  await nb.checkUserNavbar(p, usr.user2);
});

test('`br.page.reload` called with a different user', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reload(usr.user2);
  await nb.checkUserNavbar(p, usr.user2);
});

test('`br.page.reload` called to sign out', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reload(null);
  await nb.checkVisitorNavbar(p);
});

test('`br.page.signOut`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.signOut();
  await nb.checkVisitorNavbar(p);
});
