/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, Element, Page } from 'br';
import { navbarThemeMenuSel, clickNavbarThemeMenu } from 'br/com/navbar/navbar';

const themeOptionText = ['Light theme', 'Dark theme', 'Device theme'];
const cssDarkTheme = 'theme-dark';

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
  await clickNavbarThemeMenu(p);
  const menuEl = p.$(navbarThemeMenuSel);
  await checkThemeMenu(0, menuEl);
  await checkTheme(p, false);
});

test('Navbar - Change to dark theme', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await clickNavbarThemeMenu(p);
  const menuEl = p.$(navbarThemeMenuSel);
  await checkThemeMenu(0, menuEl);
  await menuEl.$aButton('Dark theme').click();
  await checkTheme(p, true);

  // Check settings are saved.
  await p.reload();
  await checkTheme(p, true);
});

test('Navbar - Change to device theme (light)', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await clickNavbarThemeMenu(p);
  const menuEl = p.$(navbarThemeMenuSel);
  await checkThemeMenu(0, menuEl);
  await menuEl.$aButton('Device theme').click();
  await checkTheme(p, false);

  // Check settings are saved.
  await p.reload();
  await checkTheme(p, false);
});

test('Navbar - Change to device theme (dark)', async ({ page }) => {
  const p = $(page);
  await p.c.emulateMedia({ colorScheme: 'dark' });
  await p.goto('/', null);
  await clickNavbarThemeMenu(p);
  const menuEl = p.$(navbarThemeMenuSel);
  await checkThemeMenu(0, menuEl);
  await menuEl.$aButton('Device theme').click();
  await checkTheme(p, true);

  // Check settings are saved.
  await p.reload();
  await checkTheme(p, true);
});

test('Navbar - Device theme monitors system theme change', async ({ page }) => {
  const p = $(page);
  await p.goto('/', null);
  await clickNavbarThemeMenu(p);
  const menuEl = p.$(navbarThemeMenuSel);
  await checkThemeMenu(0, menuEl);
  await menuEl.$aButton('Device theme').click();

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
  await clickNavbarThemeMenu(p);
  const menuEl = p.$(navbarThemeMenuSel);
  await checkThemeMenu(0, menuEl);
  await menuEl.$aButton('Light theme').click();
  await menuEl.e.not.toBeVisible();
});
