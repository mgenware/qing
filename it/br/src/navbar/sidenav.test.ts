/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { iShouldNotCallThisDelay } from '@qing/dev/it/base/delay.js';
import { test, $, usr, Page } from 'br.js';
import * as snav from 'cm/navbar/sidenav.js';

async function checkSidenavCore(p: Page) {
  await snav.clickToggler(p);
  const sidenav = p.$(snav.sidenavSel);
  await snav.checkSidenavVisible(p, true);
  await sidenav.e.toHaveCSS('overflow-x', 'hidden');
  await sidenav.e.toHaveCSS('overflow-y', 'auto');
  await p.shouldNotHaveHScrollBar();
  return sidenav;
}

function checkTogglerVisible(p: Page, visible: boolean) {
  if (visible) {
    return p.$(snav.togglerSel).e.toBeVisible();
  }
  return p.$(snav.togglerSel).e.not.toBeVisible();
}

test('Sidenav - Desktop to mobile', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await checkTogglerVisible(p, false);
  await iShouldNotCallThisDelay();
  await snav.checkSidenavVisible(p, false);

  await p.toMobile();
  await checkTogglerVisible(p, true);
});

test('Sidenav - Mobile to desktop', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, { mobile: true });
  await checkTogglerVisible(p, true);
  await snav.checkSidenavVisible(p, false);

  await p.toDesktop();
  await checkTogglerVisible(p, false);
});

test('Sidenav - Appear on mobile - Visitor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, { mobile: true });
  await checkSidenavCore(p);
});

test('Sidenav - Appear on mobile - User', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, { mobile: true });
  await snav.clickToggler(p);
  await snav.checkUser(snav.getSidenavEl(p), usr.user);
});

test('Sidenav - Sign out', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, { mobile: true });
  await snav.clickToggler(p);
  const sidenav = p.$(snav.sidenavSel);

  await sidenav.$aButton('Sign out').click();
  await snav.waitForAnimation(p, false);
  // Sidenav dismissed.
  await snav.checkSidenavVisible(p, false);
});

test('Sidenav - Dismissed', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, { mobile: true });
  await snav.clickToggler(p);
  const sidenav = p.$(snav.sidenavSel);

  await sidenav.$('.close-btn').click();
  await snav.waitForAnimation(p, false);
  await snav.checkSidenavVisible(p, false);
});

test('Sidenav - Dismiss sidenav when switching to desktop', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null, { mobile: true });
  await snav.clickToggler(p);
  await snav.checkSidenavVisible(p, true);

  await p.toDesktop();
  await snav.checkSidenavVisible(p, false);
  await checkTogglerVisible(p, false);
});
