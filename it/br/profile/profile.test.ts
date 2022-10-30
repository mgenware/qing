/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr, Page } from 'br';
import * as nbm from 'br/com/navbar/menu';
import * as snav from 'br/com/navbar/sidenav';
import { newUser } from 'helper/user';
import { defaultUserImg } from '@qing/routes/d/static';

const infoElSel = '.info-row';
const postTabSel = '#m-profile-tab-posts';
const feedSel = '#m-profile-posts';

function checkTabSelected(p: Page, tabSel: string) {
  return p.$(tabSel).e.toHaveClass('tab-active');
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
  await infoEl
    .$img({ src: '/res/avatars/2u/250_user.png', title: u.name, alt: u.name, size: 250 })
    .e.toBeVisible();
  // Profile info.
  await infoEl.$hasText('h2', u.name).e.toBeVisible();
  await infoEl.$hasText('p', 'USER_LOC').e.toBeVisible();
  await infoEl.$hasText('p', 'USER_COMPANY').e.toBeVisible();
  await infoEl
    .$('a[id="m-profile-url"][href="http://USER_WEBSITE"][target="_blank"]')
    .e.toBeVisible();
  await infoEl.$('profile-id-view[value="2u"]').shouldExist();
  await infoEl.$hasText('p', '<USER_BIO>').e.toBeVisible();
  await checkTabSelected(p, postTabSel);
});

test('Profile - New user', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto(u.link);

    const infoEl = p.$(infoElSel);
    // Profile image.
    await infoEl
      .$img({ src: defaultUserImg, title: u.name, alt: u.name, size: 250 })
      .e.toBeVisible();
    // Profile info.
    await infoEl.$hasText('h2', u.name).e.toBeVisible();

    await checkTabSelected(p, postTabSel);
    await p.$(feedSel).$('no-content-view').e.toBeVisible();
  });
});
