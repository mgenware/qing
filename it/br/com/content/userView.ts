/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User } from 'br';
import { timeFieldShouldAppear } from './timeField';

const navbarUserButtonSel = '#main-navbar dropdown dropdown-btn';

export async function userIconShouldAppear(el: brt.Element, u: User) {
  // Profile image link.
  const img = await el
    .$(`a[href="/u/${u.id}"] img[src="${u.iconURL}"][width="50"][height="50"]`)
    .shouldBeVisible();
  // A11y.
  await img.shouldHaveAttr('alt', u.name);
}

export async function userViewShouldAppear(el: brt.Element, u: User) {
  await userIconShouldAppear(el, u);
  // Name link.
  await el.$(`a[href="/u/${u.id}"]:has-text("${u.name}")`).shouldBeVisible();
  // Time field.
  await timeFieldShouldAppear(el.$('time-field small'), false);
}

export async function navbarUserViewShouldNotAppear(page: brt.Page) {
  return await page.$(navbarUserButtonSel).shouldNotExist();
}

export async function navbarUserViewShouldAppear(page: brt.Page, u: User) {
  const navbar = page.$(navbarUserButtonSel);
  await userIconShouldAppear(navbar, u);
  await navbar.$('> span:has-text("${u.name}"');
}
