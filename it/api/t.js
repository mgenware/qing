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

/**
 * @param {string} name
 * @param {PostCallback} handler
 * @returns {Promise<Object>}
 */
export async function it(name, handler) {
  return handler();
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
 * @returns {Promise<Object>}
 */
export async function post(name, url, usr, body, handler) {
  return it(name, async () => {
    // Log in if needed.
    let cookies = '';
    if (usr) {
      const loginResp = await fetch(`${serverURL}${loginURL}/-${usr.eid}`);
      cookies = loginResp.headers.raw()['set-cookie'];
    }
    return await fetchPost(url, cookies, body, handler);
  });
}

export class TempUser {
  constructor(d) {
    /**
     * @param {Object}
     * @public
     */
    this.d = d;
  }

  async dispose() {
    await fetchPost(`/__/auth/del/${this.d.eid}`);
  }
}

/**
 * @param {string} name
 * @param {PostCallback} handler
 * @returns {Promise<Object>}
 */
export async function newUser(handler) {
  return fetchPost('/__/auth/new', handler);
}
