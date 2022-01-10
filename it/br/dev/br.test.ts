/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr } from 'br';
import { navbarUserViewShouldNotAppear, navbarUserViewShouldAppear } from 'br/com/content/userView';

test('`br.page` has no users logged in', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await navbarUserViewShouldNotAppear(p);
});

test('`br.page.signIn`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await navbarUserViewShouldAppear(p, usr.user);
});

test('`br.page.reload` should not change user status', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reload(null);
  await navbarUserViewShouldAppear(p, usr.user);
});

test('`br.page.reload` called with a different user', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.reload(usr.user2);
  await navbarUserViewShouldAppear(p, usr.user2);
});

test('`br.page.signOut`', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await p.signOut(p);
  await navbarUserViewShouldNotAppear(p);
});