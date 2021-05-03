/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import puppeteer from 'puppeteer';

let browser;

/**
 * @return {Promise}
 */
export async function launchBrowser() {
  browser = await puppeteer.launch();
}

/**
 * @return {Promise<puppeteer.BrowserContext>}
 */
export async function createContext() {
  return browser.createIncognitoBrowserContext();
}

/**
 * @return {Promise}
 */
export async function closeBrowser() {
  return browser.close();
}
