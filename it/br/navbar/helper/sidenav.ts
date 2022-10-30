/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page, User, Element } from 'br';
import * as nbm from 'br/com/navbar/menu';

const togglerSel = `${nbm.navbarSel} .toggler`;

export function waitForAnimation(p: Page, visible: boolean) {
  return p.c.waitForSelector(`${nbm.sidenavSel}${visible ? '.slide-in' : ':not(.slide-in)'}`);
}

export async function clickToggler(p: Page) {
  await p.$(togglerSel).click();
  await waitForAnimation(p, true);
}

export function checkTogglerVisible(p: Page, visible: boolean) {
  if (visible) {
    return p.$(togglerSel).e.toBeVisible();
  }
  return p.$(togglerSel).e.not.toBeVisible();
}

export async function checkUser(el: Element, user: User) {
  const nameEl = el.$hasText('span', user.name);
  const imgEl = el.$img({ size: 25, src: user.iconURL, alt: user.name });

  await nameEl.e.toBeVisible();
  await imgEl.e.toBeVisible();
}

export async function checkSidenavVisible(p: Page, visible: boolean) {
  if (visible) {
    await p.$(nbm.sidenavSel).e.toHaveClass('slide-in');
  } else {
    await p.$(nbm.sidenavSel).e.not.toHaveClass('slide-in');
  }
  // Check body scrolling status.
  await p.body.e.toHaveCSS('overflow', visible ? 'hidden' : 'visible');
}

export async function testSidenavAppearingCore(p: Page) {
  await clickToggler(p);
  const sidenav = p.$(nbm.sidenavSel);
  await checkSidenavVisible(p, true);
  await sidenav.e.toHaveCSS('overflow-x', 'hidden');
  await sidenav.e.toHaveCSS('overflow-y', 'auto');
  await p.shouldNotHaveHScrollBar();
  return sidenav;
}

export async function checkVisitorSidenav(p: Page) {
  await testSidenavAppearingCore(p);
  // Sign up and sign in buttons are tested in `br/auth`.
  // Theme options are tested in theme.ts.
}

export async function checkUserSidenav(p: Page, u: User) {
  const sidenav = await testSidenavAppearingCore(p);

  await checkUser(sidenav, u);

  await sidenav.$a({ href: `/u/${u.id}`, text: 'Profile' }).e.toBeVisible();
  await sidenav.$a({ href: '/m/your-posts', text: 'Your posts' }).e.toBeVisible();
  await sidenav.$a({ href: '/m/your-fposts', text: 'Your forum posts' }).e.toBeVisible();
  await sidenav.$a({ href: '/m/settings/profile', text: 'Settings' }).e.toBeVisible();

  // Non-link items like "New post" are tested in their own test files.
  // Theme options are tested in `theme.ts`.
}
