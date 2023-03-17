/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $, Element } from 'br.js';
import * as mxRoute from '@qing/routes/mx.js';
import * as cm from './common.js';

async function checkCheckmarkView(el: Element, checked: boolean, text: string) {
  await el.shouldHaveAttrOrNot('checked', checked ? '' : null);
  await el.e.toHaveText(text);
}

test('Site settings - Languages', async ({ page }) => {
  const p = $(page);
  await p.goto(mxRoute.languages, usr.admin);

  const rootEl = p.$(cm.settingsViewSel);

  // Languages menu item gets highlighted.
  await rootEl
    .$hasText('link-button[class="link-active"][href="/mx/languages"]', 'Languages')
    .e.toBeVisible();

  const checkmarks = rootEl.$$('checkmark-view');

  await checkCheckmarkView(checkmarks.item(0), true, 'English (English)');
  await checkCheckmarkView(checkmarks.item(1), true, 'Simplified Chinese (简体中文)');
});
