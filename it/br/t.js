/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import puppeteer from 'puppeteer';
import chalk from 'chalk';
import { serverURL } from '../common.js';
import { queueTask } from '../runner.js';

// Re-exports.
export * as ass from '../ass.js';
export { usr } from '../common.js';

const browserPromise = puppeteer.launch();

export async function dispose() {
  const globalBrowser = await browserPromise;
  globalBrowser.close();
}

export class Browser {
  /**
   * Creates a `Browser`.
   * @param {puppeteer.BrowserContext} context
   * @param {string} context
   */
  constructor(name, context, page) {
    /**
     * Gets the name of this test.
     * @param {string}
     * @public
     */
    this.name = name;
    /**
     * Gets the puppeteer context.
     * @param {puppeteer.BrowserContext}
     * @public
     */
    this.context = context;
    /**
     * Gets the puppeteer page.
     * @param {puppeteer.Page}
     * @public
     */
    this.page = page;
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url
   * @returns {Promise<puppeteer.HTTPResponse | null>}
   */
  goto(url) {
    return this.page.goto(`${serverURL}${url}`);
  }

  /**
   * Gets the content of the page.
   * @returns {Promise<string>}
   */
  content() {
    return this.page.content();
  }

  dispose() {
    return this.context.close();
  }
}

/**
 * @name ItCallback
 * @function
 * @param {Browser} br
 *
 * @typedef {Object} ItOptions
 * @property {string} name
 * @property {string} queue
 */

/**
 * @property {string} name
 * @param {ItCallback} handler
 * @return {Promise}
 */
async function runHandler(name, handler) {
  const globalBrowser = await browserPromise;
  const context = await globalBrowser.createIncognitoBrowserContext();
  const page = await context.newPage();
  const userBrowser = new Browser(name, context, page);
  await handler(userBrowser);
  await userBrowser.dispose();
}

/**
 *
 * @param {ItOptions} input
 * @param {ItCallback} handler
 * @return {Promise}
 */
export async function it(input, handler) {
  const opts = typeof input === 'string' ? { name: input } : input;
  if (!opts.name) {
    throw new Error('Unnamed test');
  }
  if (!opts.queue) {
    await runHandler(opts.name, handler);
    // eslint-disable-next-line no-console
    console.log(chalk.green(opts.name));
  } else {
    await queueTask(opts.queue, () => runHandler(opts.name, handler));
    // eslint-disable-next-line no-console
    console.log(`${chalk.green(opts.name)} ${chalk.gray(`(${opts.queue})`)}`);
  }
}
