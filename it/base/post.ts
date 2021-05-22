/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fetch from 'node-fetch';
import * as urls from './urls';

export interface APIResult {
  code?: number;
  message?: string;
  d?: unknown;
}

export interface User {
  eid: string;
  name: string;
  url: string;
  iconURL: string;
}

export const usr: { user: User; admin: User } = {
  user: { eid: '2u', name: 'USER', url: '/u/2u', iconURL: '/res/user_icon/101/50_user.png' },
  admin: { eid: '2t', name: 'ADMIN', url: '/u/2t', iconURL: '/res/user_icon/101/50_admin.png' },
};

export function checkAPIResult(r: APIResult) {
  if (r.code) {
    throw new Error(`The API you are calling returns an error: ${JSON.stringify(r)}`);
  }
}

export function ensureSuccess(r: APIResult): APIResult {
  if (r.code) {
    throw new Error(`Result failed: ${JSON.stringify(r)}`);
  }
  return r;
}

export async function requestLogin(eid: string): Promise<string> {
  const loginResp = await fetch(`${urls.serverURL}${urls.loginURL}/-${eid}`);
  const cookies = loginResp.headers.raw()['set-cookie'];
  if (!cookies) {
    return '';
  }
  if (cookies.length > 1) {
    throw new Error(`Unexpected cookies: ${JSON.stringify(cookies)}`);
  }
  return cookies[0] ?? '';
}

export type PostCallback = (r: APIResult) => Promise<unknown>;

export interface PostOptions {
  url: string;
  body?: unknown;
  user?: User;
  get?: boolean;
}

export type PostInput = string | PostOptions;

export function postInputToOptions(input: PostInput): PostOptions {
  let opts: PostOptions;
  if (typeof input === 'string') {
    opts = { url: input };
  } else {
    opts = input;
  }
  return opts;
}

export async function post(input: PostInput): Promise<APIResult> {
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
