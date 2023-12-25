/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as nb from './menu.js';
import { expect } from '@playwright/test';

const dropdownChar = '▾';

async function userMenuBtnShouldAppear(p: br.BRPage, user: br.User) {
  const userText = `${user.name} ${dropdownChar}`;
  const btnEl = nb.userDropdownBtn(p);
  const nameEl = btnEl.$hasText('span', userText);
  const imgEl = btnEl.$img({ size: 25, src: user.iconURL, alt: user.name });

  await expect(nameEl.c).toBeVisible();
  await expect(imgEl.c).toBeVisible();
}

async function checkLogoEl(el: br.BRElement) {
  await expect(el.c).toHaveAttribute('href', '/');
  await expect(
    el.$img({
      size: 25,
      alt: 'Qing',
      src: '/static/img/main/qing.svg',
    }).c,
  ).toBeVisible();
}

async function checkThemeBtn(el: br.BRElement) {
  await expect(el.c).toHaveClass('dropdown-btn dropdown-btn-sys-theme');
  await expect(
    el.$('a[href="#"]').$svgIcon({
      title: 'Light theme',
      src: '/static/img/main/light-mode.svg',
    }).c,
  ).toBeVisible();
}

export async function checkVisitorNavbar(p: br.BRPage) {
  const navEl = p.$(nb.navbarSel);
  const children = navEl.$$('> *');
  await checkLogoEl(children.item(0));
  // `item(1)` is spacer.
  await expect(children.item(2).c).toHaveText('Sign in');
  await expect(children.item(3).c).toHaveText('Sign up');
  await checkThemeBtn(children.item(4));
}

// This is a brief check on desktop used by other tests to check login status.
export async function checkUserNavbar(p: br.BRPage, user: br.User) {
  const navEl = p.$(nb.navbarSel);
  const children = navEl.$$('> *');
  await checkLogoEl(children.item(0));
  // `item(1)` is spacer.
  // A quick check on user button based on location.
  // Details are checked in `userMenuBtnShouldAppear`.
  await expect(children.item(2).c).toHaveClass('dropdown-btn dropdown-btn-user');
  await userMenuBtnShouldAppear(p, user);
  await checkThemeBtn(children.item(3));
}
