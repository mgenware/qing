/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import puppeteer from 'puppeteer';

let browser: puppeteer.Browser;

export async function launchBrowser() {
  browser = await puppeteer.launch();
}

export async function createContext() {
  return browser.createIncognitoBrowserContext();
}

export async function closeBrowser() {
  return browser.close();
}
