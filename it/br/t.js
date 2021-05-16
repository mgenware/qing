/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { serverURL } from '../common.js';
import { runTask } from '../runner.js';
import { createContext } from './browser.js';

// Re-exports.
export * as ass from '../ass.js';
export { usr, post } from '../common.js';
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

  /**
   * @returns {Promise<void>}
   */
  async dispose() {
    return this.context.close();
  }
}

/**
 * @name TestCallback
 * @function
 * @param {Browser} br
 *
 * @typedef {Object} TestOptions
 * @property {string} name
 * @property {string} queue
 */

/**
 * @property {string} name
 * @param {TestCallback} handler
 * @return {Promise}
 */
async function runHandler(name, handler) {
  const context = await createContext();
  const page = await context.newPage();
  const userBrowser = new Browser(name, context, page);
  await handler(userBrowser);
  await userBrowser.dispose();
}

/**
 *
 * @param {TestOptions} input
 * @param {TestCallback} handler
 * @return {Promise}
 */
export async function test(input, handler) {
  const opts = typeof input === 'string' ? { name: input } : input;
  if (!opts.name) {
    throw new Error('Unnamed test');
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }

  await runTask(opts.name, () => runHandler(opts.name, handler), opts.queue);
}
