/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fetch from 'node-fetch';
import { loginURL, serverURL } from '../common.js';

// Exports.
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
 * @param {string} url
 * @param {string} cookies
 * @param {Object} body
 * @param {PostCallback} handler
 */
export async function fetchPost(url, cookies, body, handler) {
  if (!url || !handler) {
    throw new Error('Invalid params');
  }
  url = url.charAt(0) === '/' ? url : `/s/${url}`;
  const response = await fetch(`${serverURL}${url}`, {
    method: 'POST',
    body: body ? JSON.stringify(body) : '',
    headers: {
      'content-type': body ? 'application/json' : '',
      cookie: cookies,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  await handler(data);
}

/**
 * @param {string} name
 * @param {string} url
 * @param {Object} usr
 * @param {Object} body
 * @param {PostCallback} handler
 */
export async function post(name, url, usr, body, handler) {
  // Login if needed.
  let cookies = '';
  if (usr) {
    const loginResp = await fetch(`${serverURL}${loginURL}/-${usr.eid}`);
    cookies = loginResp.headers.raw()['set-cookie'];
  }
  return await fetchPost(url, cookies, body, handler);
}
