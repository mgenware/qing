/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, Element } from 'br';
import { navbarThemeMenuSel, clickNavbarThemeMenu } from 'br/com/navbar/navbar';

const themeOptionText = ['Light theme', 'Dark theme', 'Device theme'];

async function checkCheckbox(el: Element, checked: boolean, text: string) {
  await el.shouldContainTextContent(text);
  const checkbox = el.$('check-box');
  if (checked) {
    await checkbox.shouldHaveAttr('checked', '');
  } else {
    await checkbox.shouldNotHaveAttr('checked');
  }
}

async function checkThemeMenu(idx: number, menuEl: Element) {
  const items = menuEl.$$('a');
  await items.shouldHaveCount(3);
  await Promise.all(
    [0, 1, 2].map((i) => checkCheckbox(items.item(i), i === idx, themeOptionText[i] || '')),
  );
}

test('Navbar - default theme', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await clickNavbarThemeMenu(p);
  const menuEl = p.$(navbarThemeMenuSel);
  await checkThemeMenu(0, menuEl);
});
