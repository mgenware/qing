/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br';
import * as nbm from 'br/com/navbar/menu';
import * as ivh from 'br/com/forms/inputViewHelper';

test('Settings - Profile', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);

  await nbm.userMenuBtn(p).click();
  await nbm.userMenuEl(p).$a({ text: 'Settings', href: '/m/settings/profile' }).click();

  const rootEl = p.$('m-settings-view');
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
});
