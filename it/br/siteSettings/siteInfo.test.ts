/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br.js';
import * as mxRoute from '@qing/routes/d/mx.js';
import * as nbm from 'br/com/navbar/menu.js';
import * as ivh from 'br/com/forms/inputViewHelper.js';
import * as cm from './common.js';

const infoSectionSel = `${cm.settingsViewSel} .info-block`;

test('Site settings - Site info - Click-through from navbar', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.admin);
  await nbm.userMenuBtn(p).click();
  await nbm.userMenuEl(p).$a({ text: 'Site settings', href: '/mx/general' }).click();

  const rootEl = p.$(cm.settingsViewSel);

  // General menu item gets highlighted.
  await rootEl
    .$hasText('link-button[class="link-active"][href="/mx/general"]', 'General')
    .e.toBeVisible();

  const contentEl = p.$(infoSectionSel);
  await ivh.shouldHaveValue(contentEl.$inputView('Site name'), '__QING__');
  await ivh.shouldHaveValue(contentEl.$inputView('Site URL'), 'https://github.com/mgenware/qing');
});

test('Site settings - Site info - Required fields', async ({ page }) => {
  const p = $(page);
  await p.goto(mxRoute.general, usr.admin);

  const contentEl = p.$(infoSectionSel);

  const siteEl = contentEl.$inputView('Site name');
  await siteEl.clearInput();
  await ivh.shouldHaveRequiredError(siteEl);

  const urlEl = contentEl.$inputView('Site URL');
  await urlEl.clearInput();
  await ivh.shouldHaveRequiredError(urlEl);
});