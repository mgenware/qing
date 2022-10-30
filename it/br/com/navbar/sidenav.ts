/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page, User, Element } from 'br';
import * as nbm from './menu';

export const sidenavSel = '#sidenav';
export const togglerSel = `${nbm.navbarSel} .toggler`;

export function waitForAnimation(p: Page, visible: boolean) {
  return p.c.waitForSelector(`${sidenavSel}${visible ? '.slide-in' : ':not(.slide-in)'}`);
}

export async function clickToggler(p: Page) {
  await p.$(togglerSel).click();
  await waitForAnimation(p, true);
}

export async function checkSidenavVisible(p: Page, visible: boolean) {
  if (visible) {
    await p.$(sidenavSel).e.toHaveClass('slide-in');
  } else {
    await p.$(sidenavSel).e.not.toHaveClass('slide-in');
  }
  // Check body scrolling status.
  await p.body.e.toHaveCSS('overflow', visible ? 'hidden' : 'visible');
}

export function getSidenavEl(p: Page) {
  return p.$(sidenavSel);
}

export async function checkUser(el: Element, user: User) {
  const nameEl = el.$hasText('span', user.name);
  const imgEl = el.$img({ size: 25, src: user.iconURL, alt: user.name });

  await nameEl.e.toBeVisible();
  await imgEl.e.toBeVisible();
}
