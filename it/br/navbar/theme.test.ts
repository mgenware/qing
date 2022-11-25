/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, Element, Page } from 'br.js';
import * as nb from 'br/com/navbar/menu.js';

const themeOptionText = ['Light theme', 'Dark theme', 'Device theme'];
const cssDarkTheme = 'theme-dark';

function optionButton(menuEl: Element, text: string) {
  return menuEl.$hasText('.text', text);
}

async function checkCheckbox(el: Element, checked: boolean, text: string) {
  await el.e.toHaveText(text);
  const checkbox = el.$('check-box');
  if (checked) {
    await checkbox.e.toHaveAttribute('checked', '');
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

async function checkTheme(page: Page, dark: boolean) {
  if (dark) {
    return page.body.e.toHaveClass(cssDarkTheme);
  }
  return page.body.e.not.toHaveClass(cssDarkTheme);
}

test('Navbar - Default theme', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nb.themeMenuBtn(p).click();
  const menuEl = nb.themeMenuEl(p);
  await checkThemeMenu(0, menuEl);
  await checkTheme(p, false);
});

test('Navbar - Change to dark theme', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nb.themeMenuBtn(p).click();
  const menuEl = nb.themeMenuEl(p);
  await checkThemeMenu(0, menuEl);
  await optionButton(menuEl, 'Dark theme').click();
  await checkTheme(p, true);

  // Check settings are saved.
  await p.reload();
  await checkTheme(p, true);
});

test('Navbar - Change to device theme - Light', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nb.themeMenuBtn(p).click();
  const menuEl = nb.themeMenuEl(p);
  await checkThemeMenu(0, menuEl);
  await optionButton(menuEl, 'Device theme').click();
  await checkTheme(p, false);

  // Check settings are saved.
  await p.reload();
  await checkTheme(p, false);
});

test('Navbar - Change to device theme - Dark', async ({ page }) => {
  const p = $(page);
  await p.c.emulateMedia({ colorScheme: 'dark' });
  await p.goto('/', null);
  await nb.themeMenuBtn(p).click();
  const menuEl = nb.themeMenuEl(p);
  await checkThemeMenu(0, menuEl);
  await optionButton(menuEl, 'Device theme').click();
  await checkTheme(p, true);

  // Check settings are saved.
  await p.reload();
  await checkTheme(p, true);
});

test('Navbar - Device theme monitors system theme change', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nb.themeMenuBtn(p).click();
  const menuEl = nb.themeMenuEl(p);
  await checkThemeMenu(0, menuEl);
  await optionButton(menuEl, 'Device theme').click();

  // Check settings are saved.
  await p.reload();
  await p.c.emulateMedia({ colorScheme: 'dark' });
  await checkTheme(p, true);
  await p.c.emulateMedia({ colorScheme: 'light' });
  await checkTheme(p, false);
});

test('Navbar - Clicking theme dismisses the menu', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await nb.themeMenuBtn(p).click();
  const menuEl = nb.themeMenuEl(p);
  await checkThemeMenu(0, menuEl);
  await optionButton(menuEl, 'Light theme').click();
  await menuEl.e.not.toBeVisible();
});
