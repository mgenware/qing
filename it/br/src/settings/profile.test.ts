/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr, $ } from 'br.js';
import * as nbm from 'cm/navbar/menu.js';
import * as mRoute from '@qing/routes/i.js';
import * as ed from 'cm/editing/editor.js';
import * as ivh from 'cm/forms/inputViewHelper.js';
import { newUser } from '@qing/dev/it/helper/user.js';
import * as nbc from 'cm/navbar/checks.js';
import * as ov from 'cm/overlays/overlay.js';
import * as spn from 'cm/spinners/spinner.js';
import * as cm from './common.js';
import { test, expect } from '@playwright/test';

const bioEditorSel = '.bio-editor';

const longText = `A${'\n'.repeat(30)}B`;

test('Settings - Profile - Click-through from navbar', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await nbm.userDropdownBtn(p).click();
  await nbm.userDropdownMenu(p).$a({ text: 'Settings', href: '/i/settings/profile' }).click();

  const rootEl = p.$(cm.settingsViewSel);
  // Profile menu item highlighted.
  await expect(
    rootEl.$hasText('link-button[class="link-active"][href="/i/settings/profile"]', 'Profile').c,
  ).toBeVisible();

  // Profile picture.
  await expect(
    rootEl.$(
      'img[width="250"][height="250"][class="avatar-l profile-img"][src="/res/avatars/2u/250_user.png"]',
    ).c,
  ).toBeVisible();

  await ivh.shouldHaveValue(rootEl.$inputView('Name'), 'USER');
  await ivh.shouldHaveValue(rootEl.$inputView('URL'), 'USER_WEBSITE');
  await ivh.shouldHaveValue(rootEl.$inputView('Company'), 'USER_COMPANY');
  await ivh.shouldHaveValue(rootEl.$inputView('Location'), 'USER_LOC');

  await ed.shouldHaveContent(rootEl.$(bioEditorSel), '<p>&lt;USER_BIO&gt;</p>');
});

test('Settings - Update profile info', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto(mRoute.profileSettings, u);

    let rootEl = p.$(cm.settingsViewSel);
    await rootEl.$inputView('Name').fillInput('NEW_NAME');
    await rootEl.$inputView('URL').fillInput('NEW_URL');
    await rootEl.$inputView('Company').fillInput('NEW_COMPANY');
    await rootEl.$inputView('Location').fillInput('NEW_LOCATION');
    await ed.fill(rootEl.$(bioEditorSel), longText);

    await rootEl.$qingButton('Save').click();

    // Check if user name is live updated.
    await nbc.checkUserNavbar(p, { ...u, name: 'NEW_NAME' });

    // Check current page after reloading.
    await p.reload();
    await ivh.shouldHaveValue(rootEl.$inputView('Name'), 'NEW_NAME');
    await ivh.shouldHaveValue(rootEl.$inputView('URL'), 'NEW_URL');
    await ivh.shouldHaveValue(rootEl.$inputView('Company'), 'NEW_COMPANY');
    await ivh.shouldHaveValue(rootEl.$inputView('Location'), 'NEW_LOCATION');

    await ed.shouldHaveContent(
      rootEl.$(bioEditorSel),
      '<p>A</p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p>B</p>',
    );

    // Check user profile page.
    await p.goto(`/u/${u.id}`, null);
    rootEl = p.$('main');
    await expect(rootEl.$hasText('h2', 'NEW_NAME').c).toBeVisible();
    await expect(rootEl.$hasText('p', 'NEW_COMPANY').c).toBeVisible();
    await expect(rootEl.$hasText('p', 'NEW_LOCATION').c).toBeVisible();
    expect(await rootEl.$('.md-content').c.innerHTML()).toBe(
      '<p>A</p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p>B</p>',
    );
    await expect(rootEl.$a({ href: 'http://NEW_URL', text: 'NEW_URL' }).c).toBeVisible();
  });
});

test('Settings - Update profile picture', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto(mRoute.profileSettings, u);

    const rootEl = p.$(cm.settingsViewSel);

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
