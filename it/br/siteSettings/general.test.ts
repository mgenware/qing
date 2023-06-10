/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, usr, $ } from 'br.js';
import * as mxRoute from '@qing/routes/admin.js';
import * as nbm from 'br/cm/navbar/menu.js';
import * as ivh from 'br/cm/forms/inputViewHelper.js';
import * as cm from './common.js';

const infoSectionSel = `${cm.settingsViewSel} .info-block`;

test('Site settings - Site info - Click-through from navbar', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.admin);
  await nbm.userDropdownBtn(p).click();
  await nbm.userDropdownMenu(p).$a({ text: 'Site settings', href: '/mx/general' }).click();

  const rootEl = p.$(cm.settingsViewSel);

  // General menu item gets highlighted.
  await rootEl
    .$hasText('link-button[class="link-active"][href="/mx/general"]', 'General')
    .e.toBeVisible();

  const contentEl = p.$(infoSectionSel);
  await ivh.shouldHaveValue(contentEl.$inputView('Site name'), '__QING__');
  await ivh.shouldHaveValue(contentEl.$inputView('Site URL'), 'https://__QING__');
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

test('Site settings - Site info - Update site name', async ({ page }) => {
  const p = $(page);
  await p.goto(mxRoute.general, usr.admin);

  const contentEl = p.$(infoSectionSel);

  const siteEl = contentEl.$inputView('Site name');
  await siteEl.fillInput('__MOD__');
  await contentEl.$qingButton('Save site information').click();

  // Verify UI changes.
  await ivh.shouldHaveValue(siteEl, '__MOD__');

  // Config changes are checked at API tests.
});

test('Site settings - Site info - Update site URL', async ({ page }) => {
  const p = $(page);
  await p.goto(mxRoute.general, usr.admin);

  const contentEl = p.$(infoSectionSel);

  const siteUrlEl = contentEl.$inputView('Site URL');
  await siteUrlEl.fillInput('__MOD__');
  await contentEl.$qingButton('Save site information').click();

  // Verify UI changes.
  await ivh.shouldHaveValue(siteUrlEl, '__MOD__');

  // Config changes are checked at API tests.
});
