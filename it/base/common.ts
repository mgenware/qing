/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fetch from 'node-fetch';
import * as urls from './urls';

/**
 * @typedef {Object} APIResult
 * @property {number} code
 * @property {string} message
 * @property {Object} d
 */

export const usr = {
  visitor: 0,
  user: { eid: '2u', name: 'USER', url: '/u/2u', iconURL: '/res/user_icon/101/50_user.png' },
  admin: { eid: '2t', name: 'ADMIN', url: '/u/2t', iconURL: '/res/user_icon/101/50_admin.png' },
};

/**
 *
 * @param {APIResult} r
 */
export function checkAPIResult(r) {
  if (r.code) {
    throw new Error(`The API you are calling returns an error: ${JSON.stringify(r)}`);
  }
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

/**
 * @param {string}} eid
 * @returns {Promise<string>} - Returns cookies of the signed in user.
 */
export async function requestLogin(eid) {
  const loginResp = await fetch(`${urls.serverURL}${urls.loginURL}/-${eid}`);
  const cookies = loginResp.headers.raw()['set-cookie'];
  return cookies;
}

/**
 * @callback PostCallback
 * @param {APIResult} data - Response data.
 *
 * @typedef {Object} PostOptions
 * @property {string} url
 * @property {Object} body
 * @property {Object} user
 * @property {boolean} get
 *
 * @typedef {string|PostOptions} PostInput
 */

/**
 * @param {PostInput}} input
 * @returns {PostOptions}
 */
export function postInputToOptions(input) {
  let opts;
  if (typeof input === 'string') {
    opts = { url: input };
  } else {
    opts = input;
  }
  return opts;
}

/**
 * @param {PostInput} input - Fetch input parameters.
 * @returns {Promise<APIResult>}
 */
export async function post(input) {
  if (!input) {
    throw new Error('Unexpected empty fetch input');
  }
  const opts = postInputToOptions(input);
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
  url = `${urls.serverURL}${url}`;
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
