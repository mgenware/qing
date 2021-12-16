/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import playwright from 'playwright';

let browser: playwright.Browser;

export async function launchBrowser() {
  // eslint-disable-next-line no-console
  console.log('🌏 Browser launched.');
  browser = await playwright.chromium.launch();
}

export async function createContext() {
  return browser.newContext();
}

export async function disposeBrowser() {
  // eslint-disable-next-line no-console
  console.log('🧹 Browser disposed.');
  return browser.close();
}
