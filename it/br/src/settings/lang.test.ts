/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr, $, BRElement } from 'br.js';
import * as mRoute from '@qing/routes/i.js';
import { newUser } from '@qing/dev/it/helper/user.js';
import * as alt from 'cm/overlays/alert.js';
import * as cm from './common.js';
import { checkPageLocale } from 'routes/common.js';
import { test, expect } from '@playwright/test';

const langSettingsSel = 'lang-st';
const defOptions = [
  'Auto (based on browser settings)',
  'English (English)',
  'Simplified Chinese (简体中文)',
];

async function checkLangList(rootEl: BRElement) {
  const elsLocator = rootEl.$$('link-list-view link-button');
  await elsLocator.shouldHaveCount(defOptions.length);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await elsLocator.forEach((el, idx) => expect(el.c).toHaveText(defOptions[idx]!));
}

async function checkSelectedOption(rootEl: BRElement, idx: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const text = defOptions[idx]!;
  await expect(rootEl.$hasText('link-button', text).c).toBeVisible();
}

// Click-through from navbar is tested in `profile.test.ts`.
test('Settings - Lang - Click-through from settings', async ({ page }) => {
  const p = $(page);
  await p.goto(mRoute.profileSettings, usr.user);

  const rootEl = await cm.clickSettingsPage(p, 'Lang');

  await p.c.waitForSelector(langSettingsSel);

  // Lang menu item gets highlighted.
  await expect(
    rootEl.$hasText('link-button[class="link-active"][href="/i/settings/lang"]', 'Language').c,
  ).toBeVisible();

  // Langs.
  const langSettingsEl = rootEl.$(langSettingsSel);
  await checkLangList(langSettingsEl);
  await checkSelectedOption(langSettingsEl, 0);
});

test('Settings - Lang - Update to alternative locale', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto(mRoute.langSettings, u);

    const langSettingsEl = p.$(langSettingsSel);
    await langSettingsEl.$linkButton('Simplified Chinese (简体中文)').click();

    const dialog = await alt.wait(p, {
      title: 'Do you want to change website language to Simplified Chinese (简体中文)?',
      focusedBtn: 1,
    });

    await dialog.clickYes();

    await checkPageLocale(p, 1);
    await checkSelectedOption(langSettingsEl, 2);
  });
});

// It uses `alternativeLocale` to create a tmp user with profile lang set to
// alternative locale.
test('Settings - Lang - Revert to auto option', async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await p.goto(mRoute.langSettings, u);

      // Make sure alternative locale is working as expected.
      await checkPageLocale(p, 1);

      const langSettingsEl = p.$(langSettingsSel);
      await langSettingsEl.$linkButton('自动（基于浏览器配置）').click();

      const dialog = await alt.wait(p, {
        title: '确定要将网站语言设置为自动（基于浏览器配置）？',
        focusedBtn: 1,
      });
      // Click the YES button in Chinese.
      await dialog.clickBtn('是');

      await checkSelectedOption(langSettingsEl, 0);
      await checkPageLocale(p, 0);
    },
    { alternativeLocale: true },
  );
});
