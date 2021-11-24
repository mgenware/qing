/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as urls from './urls';
import fetch from 'node-fetch';

const errResourceNotFound = 10005;

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

export const usr: { user: User; admin: User; admin2: User; user2: User } = {
  admin: { eid: '2t', name: 'ADMIN', url: '/u/2t', iconURL: '/res/user_icon/2t/50_admin.png' },
  user: { eid: '2u', name: 'USER', url: '/u/2u', iconURL: '/res/user_icon/2u/50_user.png' },
  admin2: { eid: '2v', name: 'ADMIN2', url: '/u/2v', iconURL: '/res/user_icon/2v/50_admin2.png' },
  user2: { eid: '2w', name: 'USER2', url: '/u/2w', iconURL: '/res/user_icon/2w/50_user2.png' },
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

async function requestLogin(eid: string): Promise<string> {
  const resp = await fetch(`${urls.serverURL}${urls.loginURL}`, {
    method: 'POST',
    body: JSON.stringify({ uid: `-${eid}` }),
    headers: {
      'content-type': 'application/json',
    },
  });

  const cookies = resp.headers.raw()['set-cookie'];
  if (!cookies) {
    return '';
  }
  if (cookies.length > 1) {
    throw new Error(`Unexpected cookies: ${JSON.stringify(cookies)}`);
  }
  return cookies[0] ?? '';
}

export async function updateEntityTime(id: string, type: number) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return post({ url: urls.setDebugTimeURL, body: { id, type } });
}

export type PostCallback = (r: APIResult) => Promise<unknown>;

export interface PostOptions {
  url: string;
  body?: unknown;
  user?: User;
  get?: boolean;
  cookies?: string;
  converts404ToAPIResult?: boolean;
}

export async function post(input: PostInput): Promise<APIResult> {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
    body: get ? undefined : JSON.stringify(body ?? null),
    headers: {
      'content-type': 'application/json',
      cookie: cookies,
    },
  });
  if (!response.ok) {
    // Use by `/__/auth/info`, which is a GET request but called by both
    // BR and API tests. When `converts404ToAPIResult` is true, 404 errors
    // won't throw and instead return an `APIResult` of `errResourceNotFound`.
    if (opts.converts404ToAPIResult && response.status === 404) {
      return { code: errResourceNotFound };
    }
    // eslint-disable-next-line no-console
    console.log(`[Request info] ${JSON.stringify(opts)}`);
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as APIResult;
}
