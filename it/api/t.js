/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fetch from 'node-fetch';
import { loginURL, serverURL } from '../common.js';
import { runTask } from '../runner.js';

// Re-exports.
export * as ass from '../ass.js';
export { usr } from '../common.js';
export * as assUtil from './assUtil.js';

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
 * @typedef {Object} ItOptions
 * @property {string} name
 * @property {string} queue
 *
 * @typedef {string|FetchOptions} FetchInput
 * @typedef {string|ItOptions} ItInput
 *
 * @typedef {Object} APIResult
 * @property {number} code
 * @property {string} message
 * @property {Object} d
 */

/**
 * @param {ItInput} intput
 * @param {PostCallback} handler
 * @returns {Promise<APIResult>}
 */
export async function it(input, handler) {
  const opts = typeof input === 'string' ? { name: input } : input;
  if (!opts.name) {
    throw new Error('Unnamed test');
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }
  await runTask(opts.name, handler, opts.queue);
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
export async function requestLogin(eid) {
  const loginResp = await fetch(`${serverURL}${loginURL}/-${eid}`);
  const cookies = loginResp.headers.raw()['set-cookie'];
  return cookies;
}

/**
 * @param {FetchInput} input - Fetch input parameters.
 * @returns {Promise<APIResult>}
 */
export async function post(input) {
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
    if (!user.eid) {
      throw new Error(`EID null on object ${JSON.stringify(user)}`);
    }
    cookies = await requestLogin(user.eid);
  }

  url = url.charAt(0) === '/' ? url : `/s/${url}`;
  url = `${serverURL}${url}`;
  const response = await fetch(url, {
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
  return response.json();
}

/**
 * @param {ItInput} itInput
 * @param {FetchInput} input
 * @param {Object} user
 * @param {FetchCallback} handler
 * @returns {Promise<Object>}
 */
export async function itPost(itInput, input, user, handler) {
  return it(itInput, async () => {
    const opts = fetchInputToOptions(input);
    const d = await post({ ...opts, user });
    await handler(d);
  });
}

/**
 * @param {APIResult} r
 * @returns {APIResult}
 */
export function ensureSuccess(r) {
  if (r.code) {
    throw new Error(`Result failed: ${JSON.stringify(r)}`);
  }
  return r;
}
