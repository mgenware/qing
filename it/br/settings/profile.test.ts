/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $, Page } from 'br';
import * as nbm from 'br/com/navbar/menu';
import * as ed from 'br/com/editing/editor';
import * as ivh from 'br/com/forms/inputViewHelper';
import { newUser } from 'helper/user';
import * as nbc from 'br/com/navbar/checks';
import * as ov from '../com/overlays/overlay';
import * as spn from '../com/spinners/spinner';
import { expect } from 'expect';

const settingsViewSel = 'm-settings-view';
const bioEditorSel = '.bio-editor';

async function clickProfileSettings(p: Page) {
  await nbm.userMenuBtn(p).click();
  await nbm.userMenuEl(p).$a({ text: 'Settings', href: '/m/settings/profile' }).click();
}

test('Settings - Profile', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await clickProfileSettings(p);

  const rootEl = p.$(settingsViewSel);
  // Profile menu item highlighted.
  await rootEl.$('a[class="link-active"][href="/m/settings/profile"]').e.toBeVisible();

  // Profile picture.
  await rootEl
    .$(
      'img[width="250"][height="250"][class="avatar-l profile-img"][src="/res/avatars/2u/250_user.png"]',
    )
    .e.toBeVisible();

  await ivh.shouldHaveValue(rootEl.$inputView('Name'), 'USER');
  await ivh.shouldHaveValue(rootEl.$inputView('URL'), 'USER_WEBSITE');
  await ivh.shouldHaveValue(rootEl.$inputView('Company'), 'USER_COMPANY');
  await ivh.shouldHaveValue(rootEl.$inputView('Location'), 'USER_LOC');

  await ed.shouldHaveHTML(rootEl.$(bioEditorSel), '<p>&lt;USER_BIO&gt;</p>');
});

test('Settings - Update profile info', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto('/', u);
    await clickProfileSettings(p);

    let rootEl = p.$(settingsViewSel);
    await rootEl.$inputView('Name').fillInput('NEW_NAME');
    await rootEl.$inputView('URL').fillInput('NEW_URL');
    await rootEl.$inputView('Company').fillInput('NEW_COMPANY');
    await rootEl.$inputView('Location').fillInput('NEW_LOCATION');
    await ed.fill(rootEl.$(bioEditorSel), '<NEW_USER_BIO>');

    await rootEl.$qingButton('Save').click();

    // Check if user name is live updated.
    await nbc.checkUserNavbar(p, { ...u, name: 'NEW_NAME' });

    // Check current page after reloading.
    await p.reload();
    await ivh.shouldHaveValue(rootEl.$inputView('Name'), 'NEW_NAME');
    await ivh.shouldHaveValue(rootEl.$inputView('URL'), 'NEW_URL');
    await ivh.shouldHaveValue(rootEl.$inputView('Company'), 'NEW_COMPANY');
    await ivh.shouldHaveValue(rootEl.$inputView('Location'), 'NEW_LOCATION');

    await ed.shouldHaveHTML(rootEl.$(bioEditorSel), '<p>&lt;NEW_USER_BIO&gt;</p>');

    // Check user profile page.
    await p.goto(`/u/${u.id}`, null);
    rootEl = p.$('container-view');
    await rootEl.$hasText('h2', 'NEW_NAME').e.toBeVisible();
    await rootEl.$hasText('p', 'NEW_COMPANY').e.toBeVisible();
    await rootEl.$hasText('p', 'NEW_LOCATION').e.toBeVisible();
    await rootEl.$hasText('p', '<NEW_USER_BIO>').e.toBeVisible();
    await rootEl.$a({ href: 'http://NEW_URL', text: 'NEW_URL' }).e.toBeVisible();
  });
});

test('Settings - Update profile picture', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto('/', u);
    await clickProfileSettings(p);

    const rootEl = p.$(settingsViewSel);

    // Note that Promise.all prevents a race condition
    // between clicking and waiting for the file chooser.
    const [fileChooser] = await Promise.all([
      // It is important to call waitForEvent before click to set up waiting.
      page.waitForEvent('filechooser'),
      // Opens the file chooser.
      rootEl.$('label[class="cursor-pointer"]').click(),
    ]);
    await fileChooser.setFiles('./files/img1.jpg');
    const overlayEl = p.$(ov.openSel('avatar-uploader'));
    await spn.waitForGlobal(p, 'Uploading...', () => overlayEl.$qingButton('OK').click());

    const profileImg = rootEl.$('img[width="250"][height="250"][class="avatar-l profile-img"]');
    const newURL = await profileImg.getAttribute('src');
    expect(newURL?.startsWith(`/res/avatars/${u.id}/`)).toBeTruthy();
  });
});
