/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $, Page, User, Element } from 'br';
import * as nb from 'br/com/navbar/navbar';

const dropdownChar = '▾';

interface NavbarUserArgs {
  user: User;
  sideNav: boolean;
}

async function userMenuBtnShouldAppear(p: Page, e: NavbarUserArgs) {
  const userText = e.sideNav ? e.user.name : `${e.user.name} ${dropdownChar}`;
  const btnEl = nb.userMenuBtn(p);
  const nameEl = btnEl.$hasText('span', userText);
  const imgEl = btnEl.$(`img[src="${e.user.iconURL}"][width="25"][height="25"]`);

  await nameEl.e.toBeVisible();
  await imgEl.e.toBeVisible();
}

async function checkLogoEl(el: Element) {
  await el.e.toHaveAttribute('href', '/');
  await el
    .$img({
      size: 25,
      title: 'Qing',
      src: '/static/img/main/qing.svg',
    })
    .e.toBeVisible();
}

async function checkThemeBtn(el: Element) {
  await el.e.toHaveClass('dropdown-btn');
  await el
    .$('a[href="#"]')
    .$img({
      size: 25,
      title: 'Light theme',
      src: '/static/img/main/light-mode.svg',
    })
    .e.toBeVisible();
}

async function checkVisitorNavbar(p: Page) {
  const navEl = nb.navEl(p);
  const children = navEl.$$('> *');
  await checkLogoEl(children.item(0));
  // `item(1)` is spaceer.
  await children.item(2).e.toHaveText('Sign in');
  await children.item(3).e.toHaveText('Sign up');
  await checkThemeBtn(children.item(4));
}

async function checkUserNavbar(p: Page, e: NavbarUserArgs) {
  const navEl = nb.navEl(p);
  const children = navEl.$$('> *');
  await checkLogoEl(children.item(0));
  // `item(1)` is spaceer.
  await userMenuBtnShouldAppear(p, e);
  await checkThemeBtn(children.item(3));
}

test('Navbar - visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await checkVisitorNavbar(p);
});

test('Navbar - user', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await checkUserNavbar(p, { user: usr.user, sideNav: false });
  // Keep login status after reloading.
  await p.reload();
  await checkUserNavbar(p, { user: usr.user, sideNav: false });
});

test('Navbar - logout', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  const userBtn = nb.userMenuBtn(p);
  await userBtn.$aButton('Sign out').click();
  await checkVisitorNavbar(p);
});
