/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as apiAuth from '@qing/routes/d/dev/api/auth';
import { serverURL } from './def';
import fetch, { Response } from 'node-fetch';
import CookieJar from 'helper/cookieJar';

function getSetCookies(resp: Response) {
  return resp.headers.raw()['set-cookie'];
}

// The result of an API call.
export interface APIResult {
  c?: number;
  m?: string;
  d?: unknown;
}

// Copied from `sod/auth`.
export interface User {
  id: string;
  name: string;
  iconURL: string;
  link: string;
  admin?: boolean;
}

// Pre-defined user constants.
export const usr: { user: User; admin: User; admin2: User; user2: User } = {
  admin: { id: '2t', name: 'ADMIN', link: '/u/2t', iconURL: '/res/avatars/2t/50_admin.png' },
  user: { id: '2u', name: 'USER', link: '/u/2u', iconURL: '/res/avatars/2u/50_user.png' },
  admin2: { id: '2v', name: 'ADMIN2', link: '/u/2v', iconURL: '/res/avatars/2v/50_admin2.png' },
  user2: { id: '2w', name: 'USER2', link: '/u/2w', iconURL: '/res/avatars/2w/50_user2.png' },
};

export const authUsr = {
  user: { email: 'user@mgenware.com', pwd: '123456' },
};

export const errorGeneric = 1;

// Pre-defined API error results.
export const errorResults = {
  notAuthorized: { c: errorGeneric, m: 'You need to log in to access this.' },
  rowNotUpdated: { c: errorGeneric, m: 'Expected 1 rows affected, got 0.' },
  resNotFound: { c: errorGeneric, m: 'Resource not found' },
};

export type APICallback = (r: APIResult) => Promise<unknown>;

export interface APIOptions {
  body?: unknown;
  cookieJar?: CookieJar;
}

function checkAPISuccess(res: APIResult, url: string) {
  if (res.c) {
    throw new Error(`API failed with error ${JSON.stringify(res)}. URL: ${url}`);
  }
}

async function apiResultFromResponse(response: Response, url: string) {
  const apiRes = (await response.json()) as APIResult | null;
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!apiRes) {
    throw new Error(`Unexpected null result from URL ${url}`);
  }
  return apiRes;
}

// Sends a quick(dev only) login request and returns session cookies.
async function requestLogin(id: string, cookieJar: CookieJar | undefined) {
  const url = apiAuth.in_;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const response = await startFetch(
    url,
    {
      uid: id,
    },
    { cookieJar },
  );

  const res = await apiResultFromResponse(response, url);
  checkAPISuccess(res, url);
}

// Exported only for tests. Do not use.
export const dontUseRequestLogin = requestLogin;

// Wrapper around a node-fetch POST request.
async function startFetch(
  url: string,
  body: Record<string, unknown> | null,
  opt?: APIOptions,
): Promise<Response> {
  // eslint-disable-next-line no-param-reassign
  url = url.charAt(0) === '/' ? url : `/s/${url}`;
  // eslint-disable-next-line no-param-reassign
  url = `${serverURL}${url}`;
  const response = await fetch(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : null,
    headers: {
      'content-type': 'application/json',
      cookie: opt?.cookieJar?.cookies() ?? '',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} from URL ${url}`);
  }
  if (opt?.cookieJar) {
    opt.cookieJar.setCookies(getSetCookies(response));
  }
  return response;
}

// Initiates an API call with the given params.
// NOTE: If `user` is specified, `opt.cookies` is no longer used.
export async function apiRaw(
  url: string,
  body: Record<string, unknown> | null,
  user?: User | null,
  opt?: APIOptions,
): Promise<APIResult> {
  // There must be one cookie jar for login to work.
  const cookieJar = opt?.cookieJar ?? new CookieJar();
  if (user) {
    await requestLogin(user.id, cookieJar);
  }
  const response = await startFetch(url, body, { ...opt, cookieJar });
  return apiResultFromResponse(response, url);
}

export async function api<T = null>(
  url: string,
  body: Record<string, unknown> | null,
  user?: User | null,
  opt?: APIOptions,
): Promise<T> {
  const res = await apiRaw(url, body, user, opt);
  checkAPISuccess(res, url);
  return res.d as T;
}
