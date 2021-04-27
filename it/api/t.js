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
export { usr } from '../common.js';

/**
 * @callback FetchCallback
 * @param {object} data - Response data.
 *
 * @typedef {Object} FetchOptions
 * @property {string} url
 * @property {Object} body
 * @property {Object} user
 * @property {boolean} get
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
 * @param {string}} eid
 * @returns {Promise<string>} - Returns cookies of the signed in user.
 */
export async function signIn(eid) {
  const loginResp = await fetch(`${serverURL}${loginURL}/-${eid}`);
  cookies = loginResp.headers.raw()['set-cookie'];
  return cookies;
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
  const { body, get, user } = opts;
  let { url } = opts;
  if (!url) {
    throw new Error(`Unexpected empty URL in options ${JSON.stringify(opts)}`);
  }

  // Log in if needed.
  let cookies = '';
  if (user) {
    cookies = await signIn(user.eid);
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
 * @param {Object} user
 * @param {FetchCallback} handler
 * @returns {Promise<Object>}
 */
export async function post(name, input, user, handler) {
  return it(name, async () => {
    const opts = fetchInputToOptions(input);
    const d = await sendPost({ ...opts, user });
    handler(d);
  });
}
