/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User } from 'br';
import { timeFieldShouldAppear } from './timeField';

const navbarUserButtonSel = '#main-navbar .dropdown .dropdown-btn';

export interface UserViewShouldAppearArg {
  user: User;
  hasEdited?: boolean;
}

async function userIconShouldAppear(el: brt.Element, u: User) {
  const img = await el
    .$(`a[href="/u/${u.id}"] img[src="${u.iconURL}"][width="50"][height="50"]`)
    .shouldBeVisible();
  await img.shouldHaveAttr('alt', u.name);
}

async function navbarUserIconShouldAppear(el: brt.Element, arg: UserViewShouldAppearArg) {
  const u = arg.user;
  const img = await el.$(`img[src="${u.iconURL}"][width="20"][height="20"]`).shouldBeVisible();
  await img.shouldHaveAttr('alt', u.name);
}

export async function userViewShouldAppear(el: brt.Element, arg: UserViewShouldAppearArg) {
  const u = arg.user;
  await userIconShouldAppear(el, u);
  // Name link.
  await el.$(`a[href="/u/${u.id}"]:has-text("${u.name}")`).shouldBeVisible();
  // Time field.
  await timeFieldShouldAppear(el.$('time-field small'), !!arg.hasEdited);
}

export async function navbarUserViewShouldNotAppear(page: brt.Page) {
  return page.$(navbarUserButtonSel).shouldNotExist();
}

export async function navbarUserViewShouldAppear(page: brt.Page, u: User) {
  const navbar = page.$(navbarUserButtonSel);
  await navbarUserIconShouldAppear(navbar, { user: u });
  await navbar.$hasText('span', u.name).shouldExist();
}
