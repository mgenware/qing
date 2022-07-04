/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { UserViewShouldAppearArg } from '../content/userView';

const navbarUserButtonSel = '#main-navbar #user-menu-btn';
// After migrating to floating-ui, navbar menus live in global space.
export const navbarUserMenuSel = '#user-menu';

async function navbarUserIconShouldAppear(el: br.Element, arg: UserViewShouldAppearArg) {
  const u = arg.user;
  const img = el.$(`img[src="${u.iconURL}"][width="25"][height="25"]`);
  await img.shouldBeVisible();
  await img.shouldHaveAttr('alt', u.name);
}

export async function navbarUserViewShouldNotAppear(page: br.Page) {
  return page.$(navbarUserButtonSel).shouldNotExist();
}

export async function navbarUserViewShouldAppear(page: br.Page, u: br.User) {
  const navbar = page.$(navbarUserButtonSel);
  await navbarUserIconShouldAppear(navbar, { user: u });
  await navbar.$hasText('span', u.name).shouldExist();
}

export async function clickNavbarUserMenu(page: br.Page) {
  return page.$(navbarUserButtonSel).click();
}
