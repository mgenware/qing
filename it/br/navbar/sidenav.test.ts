/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr } from 'br';
import * as nbm from 'br/com/navbar/menu';
import * as helper from './helper/sidenav';

test('Sidenav - Desktop to mobile', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await helper.checkTogglerVisible(p, false);
  await p.delay();
  await helper.checkSidenavVisible(p, false);

  await p.toMobile();
  await helper.checkTogglerVisible(p, true);
});

test('Sidenav - Mobile to desktop', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, { mobile: true });
  await helper.checkTogglerVisible(p, true);
  await helper.checkSidenavVisible(p, false);

  await p.toDesktop();
  await helper.checkTogglerVisible(p, false);
});

test('Sidenav - Appear on mobile - Visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, { mobile: true });
  await helper.checkVisitorSidenav(p);
});

test('Sidenav - Appear on mobile - User', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, { mobile: true });
  await helper.checkUserSidenav(p, usr.user);
});

test('Sidenav - Sign out', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, { mobile: true });
  await helper.clickToggler(p);
  const sidenav = p.$(nbm.sidenavSel);

  await sidenav.$aButton('Sign out').click();
  await helper.waitForAnimation(p, false);
  // Sidenav dismissed.
  await helper.checkSidenavVisible(p, false);
  await helper.checkVisitorSidenav(p);
});

test('Sidenav - Dismissed', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, { mobile: true });
  await helper.clickToggler(p);
  const sidenav = p.$(nbm.sidenavSel);

  await sidenav.$('.close-btn').click();
  await helper.waitForAnimation(p, false);
  await helper.checkSidenavVisible(p, false);
});

test('Sidenav - Dismiss sidenav when switching to desktop', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, { mobile: true });
  await helper.clickToggler(p);
  await helper.checkSidenavVisible(p, true);

  await p.toDesktop();
  await helper.checkSidenavVisible(p, false);
  await helper.checkTogglerVisible(p, false);
});
