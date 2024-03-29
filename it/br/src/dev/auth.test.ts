/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { $, BRPage, usr } from 'br.js';
import * as nbc from 'cm/navbar/checks.js';
import { authRoot } from '@qing/routes/dev/auth.js';
import { test } from '@playwright/test';

async function clickSignInButton(p: BRPage, s: string, eid: boolean) {
  const el = p.$('.br-user');
  if (eid) {
    await el.$checkItem('Encoded').click();
  }
  await el.$('input-view[label="UID"] input').c.fill(s);
  await el.$qingButton('Sign in').click();
}

test('__/auth login by ID', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoot, null);
  await clickSignInButton(p, '103', false);
  await nbc.checkUserNavbar(p, usr.admin2);
});

test('__/auth login by EID', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoot, null);
  await clickSignInButton(p, usr.admin2.id, true);
  await nbc.checkUserNavbar(p, usr.admin2);
});
