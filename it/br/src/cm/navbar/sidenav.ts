/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BRPage, User, BRElement } from 'br.js';
import * as nbm from './menu.js';
import { expect } from '@playwright/test';

export const sidenavSel = '#sidenav';
export const togglerSel = `${nbm.navbarSel} .toggler`;

export function waitForAnimation(p: BRPage, visible: boolean) {
  return p.c.waitForSelector(`${sidenavSel}${visible ? '.slide-in' : ':not(.slide-in)'}`);
}

export async function clickToggler(p: BRPage) {
  await p.$(togglerSel).click();
  await waitForAnimation(p, true);
}

export async function checkSidenavVisible(p: BRPage, visible: boolean) {
  if (visible) {
    await expect(p.$(sidenavSel).c).toHaveClass('slide-in');
  } else {
    await expect(p.$(sidenavSel).c).not.toHaveClass('slide-in');
  }
  // Check body scrolling status.
  await expect(p.body.c).toHaveCSS('overflow', visible ? 'hidden' : 'visible');
}

export function getSidenavEl(p: BRPage) {
  return p.$(sidenavSel);
}

export async function checkUser(el: BRElement, user: User) {
  const nameEl = el.$hasText('span', user.name);
  const imgEl = el.$img({ size: 25, src: user.iconURL, alt: user.name });

  await expect(nameEl.c).toBeVisible();
  await expect(imgEl.c).toBeVisible();
}
