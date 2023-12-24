/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $, Element } from 'br.js';
import * as adminRoute from '@qing/routes/admin.js';
import * as cm from './common.js';

async function checkCheckmarkView(el: Element, checked: boolean, text: string) {
  await el.shouldHaveAttrOrNot('checked', checked ? '' : null);
  await el.e.toHaveText(text);
}

test('Site settings - Languages', async ({ page }) => {
  const p = $(page);
  await p.goto(adminRoute.languages, usr.admin);

  const rootEl = p.$(cm.settingsViewSel);

  // Languages menu item gets highlighted.
  await rootEl
    .$hasText('link-button[class="link-active"][href="/admin/languages"]', 'Languages')
    .e.toBeVisible();

  const checkmarks = rootEl.$$('check-item');

  await checkCheckmarkView(checkmarks.item(0), true, 'English (English)');
  await checkCheckmarkView(checkmarks.item(1), true, 'Simplified Chinese (简体中文)');
});
