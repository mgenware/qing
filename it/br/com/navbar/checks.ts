/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import * as nb from './menu';

const dropdownChar = '▾';

interface NavbarUserArgs {
  user: br.User;
  sidenav: boolean;
}

async function userMenuBtnShouldAppear(p: br.Page, e: NavbarUserArgs) {
  const userText = e.sidenav ? e.user.name : `${e.user.name} ${dropdownChar}`;
  const btnEl = nb.userMenuBtn(p);
  const nameEl = btnEl.$hasText('span', userText);
  const imgEl = btnEl.$(`img[src="${e.user.iconURL}"][width="25"][height="25"]`);

  await nameEl.e.toBeVisible();
  await imgEl.e.toBeVisible();
}

async function checkLogoEl(el: br.Element) {
  await el.e.toHaveAttribute('href', '/');
  await el
    .$img({
      size: 25,
      title: 'Qing',
      src: '/static/img/main/qing.svg',
    })
    .e.toBeVisible();
}

async function checkThemeBtn(el: br.Element) {
  await el.e.toHaveClass('dropdown-btn theme-group');
  await el
    .$('a[href="#"]')
    .$img({
      size: 25,
      title: 'Light theme',
      src: '/static/img/main/light-mode.svg',
    })
    .e.toBeVisible();
}

export async function checkVisitorNavbar(p: br.Page) {
  const navEl = p.$(nb.navbarSel);
  const children = navEl.$$('> *');
  await checkLogoEl(children.item(0));
  // `item(1)` is spacer.
  await children.item(2).e.toHaveText('Sign in');
  await children.item(3).e.toHaveText('Sign up');
  await checkThemeBtn(children.item(4));
}

export async function checkUserNavbar(p: br.Page, e: NavbarUserArgs) {
  const navEl = p.$(e.sidenav ? nb.sidenavSel : nb.navbarSel);
  const children = navEl.$$('> *');
  await checkLogoEl(children.item(0));
  // `item(1)` is spacer.
  // A quick check on user button based on location.
  // Details are checked in `userMenuBtnShouldAppear`.
  await children.item(2).e.toHaveClass('dropdown-btn user-group');
  await userMenuBtnShouldAppear(p, e);
  await checkThemeBtn(children.item(3));
}
