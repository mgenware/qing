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
 * @callback FetchCallback
 * @param {object} data - Response data.
 *
 * @typedef {Object} FetchOptions
 * @property {string} url - Request URL.
 * @property {Object} body - Request body.
 * @property {string} cookies - Request cookies.
 * @property {boolean} get - True if it's a GET request.
 *
 * @typedef {string|FetchOptions} FetchInput
 *
 * @typedef {Object} APIResult
 * @property {number} code
 * @property {string} message
 * @property {Object} d
 */

/**
 * @param {string} name
 * @param {PostCallback} handler
 * @returns {Promise<APIResult>}
 */
export async function it(name, handler) {
  return handler();
}

/**
 * @param {FetchInput}} input - Fetch input parameters.
 * @returns {FetchOptions}
 */
function fetchInputToOptions(input) {
  let opts;
  if (typeof input === 'string') {
    opts = { url: input };
  } else {
    opts = input;
  }
  return opts;
}

/**
 * @param {FetchInput}} input - Fetch input parameters.
 * @returns {Promise<APIResult>}
 */
export async function sendPost(input) {
  if (!input) {
    throw new Error('Unexpected empty fetch input');
  }
  const opts = fetchInputToOptions(input);
  const { body, cookies, get } = opts;
  let { url } = opts;
  if (!url) {
    throw new Error(`Unexpected empty URL in options ${JSON.stringify(opts)}`);
  }
  url = url.charAt(0) === '/' ? url : `/s/${url}`;
  const response = await fetch(`${serverURL}${url}`, {
    method: get ? 'GET' : 'POST',
    body: body ? JSON.stringify(body) : '',
    headers: {
      'content-type': body ? 'application/json' : '',
      cookie: cookies,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json();
}

/**
 * @param {string} name
 * @param {FetchInput} input
 * @param {Object} usr
 * @param {FetchCallback} handler
 * @returns {Promise<Object>}
 */
export async function post(name, input, usr, handler) {
  return it(name, async () => {
    // Log in if needed.
    let cookies = '';
    if (usr) {
      const loginResp = await fetch(`${serverURL}${loginURL}/-${usr.eid}`);
      cookies = loginResp.headers.raw()['set-cookie'];
    }
    const opts = fetchInputToOptions(input);
    const d = await sendPost({ ...opts, cookies });
    handler(d);
  });
}
