/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, Page, usr, User, Element } from 'br';
import * as nbm from 'br/com/navbar/menu';

const togglerSel = `${nbm.navbarSel} .toggler`;

async function checkUser(el: Element, user: User) {
  const nameEl = el.$hasText('span', user.name);
  const imgEl = el.$img({ size: 25, src: user.iconURL, alt: user.name });

  await nameEl.e.toBeVisible();
  await imgEl.e.toBeVisible();
}

test('Sidenav - Not showing on desktop', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, true);
  await p.$(togglerSel).e.not.toBeVisible();
  await p.$(nbm.sidenavSel).e.not.toBeVisible();
});

async function testSidenavAppearingCore(p: Page) {
  await p.$(togglerSel).click();
  const sidenav = p.$(nbm.sidenavSel);
  await sidenav.e.toBeVisible();
  await sidenav.e.toHaveCSS('overflow-x', 'hidden');
  await sidenav.e.toHaveCSS('overflow-y', 'auto');
  return sidenav;
}

test('Sidenav - Appear on mobile - Visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, true);
  const sidenav = await testSidenavAppearingCore(p);
  await sidenav.$a({ href: '/auth/signin', text: 'Sign in' }).e.toBeVisible();
  await sidenav.$a({ href: '/auth/signup', text: 'Sign up' }).e.toBeVisible();

  // Theme options are tested in theme.ts.
});

test('Sidenav - Appear on mobile - User', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, true);
  const sidenav = await testSidenavAppearingCore(p);

  await checkUser(sidenav, usr.user);

  await sidenav.$a({ href: `/u/${usr.user.id}`, text: 'Profile' }).e.toBeVisible();
  await sidenav.$a({ href: '/m/your-posts', text: 'Your posts' }).e.toBeVisible();
  await sidenav.$a({ href: '/m/your-threads', text: 'Your threads' }).e.toBeVisible();
  await sidenav.$a({ href: '/m/settings/profile', text: 'Settings' }).e.toBeVisible();
  // TODO: tests for new post and new thread.

  // Theme options are tested in theme.ts.
});

test('Sidenav - Sign out', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, true);
  await p.$(togglerSel).click();
  const sidenav = p.$(nbm.sidenavSel);

  await sidenav.$aButton('Sign out').click();
  await p.$(nbm.sidenavSel).e.not.toBeVisible();
});
