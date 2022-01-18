/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, Page, usr } from 'br';
import { navbarUserViewShouldAppear } from 'br/com/content/userView';

const url = '/__/auth';

async function clickSignInButton(p: Page, s: string, eid: boolean) {
  const el = p.$('.br-user');
  if (eid) {
    await el.$checkBox({ text: 'Encoded', radio: true }).click();
  }
  await el.$('input-view[label="UID"] input').fill(s);
  await el.$qingButton('Sign in').click();
}

test('__/auth login by ID', async ({ page }) => {
  const p = $(page);
  await p.goto(url, null);
  await clickSignInButton(p, '103', false);
  await navbarUserViewShouldAppear(p, usr.admin2);
});

test('__/auth login by EID', async ({ page }) => {
  const p = $(page);
  await p.goto(url, null);
  await clickSignInButton(p, usr.admin2.id, true);
  await navbarUserViewShouldAppear(p, usr.admin2);
});
