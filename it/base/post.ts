/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as urls from './urls';
import fetch from 'node-fetch';

export interface APIResult {
  code?: number;
  message?: string;
  d?: unknown;
}

export interface User {
  id: string;
  name: string;
  url: string;
  iconURL: string;
}

export const usr: { user: User; admin: User; admin2: User; user2: User } = {
  admin: { id: '2t', name: 'ADMIN', url: '/u/2t', iconURL: '/res/user_icon/2t/50_admin.png' },
  user: { id: '2u', name: 'USER', url: '/u/2u', iconURL: '/res/user_icon/2u/50_user.png' },
  admin2: { id: '2v', name: 'ADMIN2', url: '/u/2v', iconURL: '/res/user_icon/2v/50_admin2.png' },
  user2: { id: '2w', name: 'USER2', url: '/u/2w', iconURL: '/res/user_icon/2w/50_user2.png' },
};

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
  return post(urls.setDebugTimeURL, { body: { id, type } });
}

export type PostCallback = (r: APIResult) => Promise<unknown>;

export interface PostParams {
  body?: unknown;
  user?: User;
  cookies?: string;
  ignoreAPIResultErrors?: boolean;
}

export async function post(url: string, params?: PostParams): Promise<APIResult> {
  const p = params ?? {};

  // Log in if needed.
  let cookies = '';
  if (p.user) {
    if (!p.user.id) {
      throw new Error(`${JSON.stringify(p.user)} must have a valid ID`);
    }
    cookies = await requestLogin(p.user.id);
  }

  // eslint-disable-next-line no-param-reassign
  url = url.charAt(0) === '/' ? url : `/s/${url}`;
  // eslint-disable-next-line no-param-reassign
  url = `${urls.serverURL}${url}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(p.body ?? null),
    headers: {
      'content-type': 'application/json',
      cookie: cookies,
    },
  });
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.log(`[Request info] ${JSON.stringify(p)}`);
    throw new Error(`HTTP error: ${response.status} from URL ${url}`);
  }
  const apiRes = (await response.json()) as APIResult;
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!apiRes) {
    throw new Error(`Unexpected null result from URL ${url}`);
  }
  if (apiRes.code && !p.ignoreAPIResultErrors) {
    throw new Error(`API failed: ${JSON.stringify(apiRes)}. URL: ${url}`);
  }
  return apiRes;
}
