/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { $, BRPage, usr } from 'br.js';
import * as nbm from 'cm/navbar/menu.js';
import * as snav from 'cm/navbar/sidenav.js';
import { newUser } from '@qing/dev/it/helper/user.js';
import { defaultUserImg } from '@qing/routes/static.js';
import { test, expect } from '@playwright/test';

const infoElSel = '.info-row';
const postTabSel = '#m-profile-tab-posts';
const feedSel = '#m-profile-posts';

function checkTabSelected(p: BRPage, tabSel: string) {
  return expect(p.$(tabSel).c).toHaveClass('tab-active');
}

test('Profile - Click-through', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  const navbarEl = p.$(nbm.navbarSel);
  await navbarEl.$a({ href: usr.user.link, text: 'Profile' }).shouldExist();
});

test('Profile - Click-through - Mobile', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user, { mobile: true });
  await snav.clickToggler(p);
  const sidenav = snav.getSidenavEl(p);
  await sidenav.$a({ href: usr.user.link, text: 'Profile' }).shouldExist();
});

test('Profile - Info', async ({ page }) => {
  const p = $(page);
  const u = usr.user;
  await p.goto(u.link);

  const infoEl = p.$(infoElSel);
  // Profile image.
  await expect(
    infoEl.$img({ src: '/res/avatars/2u/250_user.png', title: u.name, alt: u.name, size: 250 }).c,
  ).toBeVisible();
  // Profile info.
  await expect(infoEl.$hasText('h2', u.name).c).toBeVisible();
  await expect(infoEl.$hasText('p', 'USER_LOC').c).toBeVisible();
  await expect(infoEl.$hasText('p', 'USER_COMPANY').c).toBeVisible();
  await expect(
    infoEl.$('a[id="m-profile-url"][href="http://USER_WEBSITE"][target="_blank"]').c,
  ).toBeVisible();
  await infoEl.$('profile-id-view[value="2u"]').shouldExist();
  const bioEl = infoEl.$('.md-content');
  await bioEl.shouldHaveHTML('&lt;USER_BIO&gt;');
  await checkTabSelected(p, postTabSel);
});

test('Profile - New user', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto(u.link);

    const infoEl = p.$(infoElSel);

    // Profile image.
    await expect(
      infoEl.$img({ src: defaultUserImg, title: u.name, alt: u.name, size: 250 }).c,
    ).toBeVisible();
    // Profile info.
    await expect(infoEl.$hasText('h2', u.name).c).toBeVisible();

    await checkTabSelected(p, postTabSel);
    await expect(p.$(feedSel).$hasText('notice-view', 'No content available').c).toBeVisible();
  });
});

test('Profile - Private account', async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await p.goto(u.link);

      const infoEl = p.$(infoElSel);

      // Profile image.
      await expect(
        infoEl.$img({ src: defaultUserImg, title: u.name, alt: u.name, size: 250 }).c,
      ).toBeVisible();
      // Profile info.
      await expect(infoEl.$hasText('h2', u.name).c).toBeVisible();

      await checkTabSelected(p, postTabSel);
      await expect(p.$(feedSel).$hasText('notice-view', 'This profile is private').c).toBeVisible();
    },
    { privateAccount: true },
  );
});
