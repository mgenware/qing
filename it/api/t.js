/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fetch from 'node-fetch';
import { serverURL } from '../common.js';
export * as ass from '../ass.js';
export * as assUtil from './assUtil.js';
export { user } from '../common.js';

export class Context {
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
 * @name PostCallback
 * @function
 * @param {object} data
 */

/**
 *
 * @param {string} name
 * @param {string} url
 * @param {number} user
 * @param {PostCallback} handler
 */
export async function post(name, url, usr, body, handler) {
  const response = await fetch(`${serverURL}/s${url}`, {
    method: 'POST',
    body: body ? JSON.stringify(body) : '',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  await handler(data);
}
