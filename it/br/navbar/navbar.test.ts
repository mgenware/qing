/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br';

const navBarID = '#main-navbar';

test('Navbar - visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await p.$(`${navBarID} > .dropdown`).shouldNotExist();
});

test('Navbar - user', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  const userEl = p.$(`${navBarID} .dropdown-btn`);
  await userEl.$(`img[src="${usr.user.iconURL}"][width="20"][height="20"]`).shouldBeVisible();
  await userEl.shouldContainTextContent('USER ▾');
});

test('Navbar - logout', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  const userEl = p.$(`${navBarID} .dropdown-btn`);
  await userEl.$hasText('a[href="#"]', 'Sign out').click();
  await p.$(`${navBarID} > .dropdown`).shouldNotExist();
});
