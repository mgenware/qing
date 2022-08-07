/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as apiAuth from '@qing/routes/d/dev/api/auth';
import { serverURL } from './def';
import fetch, { Response } from 'node-fetch';

const emptyCookieErr = 'Unexpected empty cookies from login API';

function getSetCookies(resp: Response) {
  return resp.headers.raw()['set-cookie'];
}

// The result of an API call.
export interface APIResult {
  code?: number;
  msg?: string;
  d?: unknown;
}

// Represents user information in API calls.
export interface User {
  id: string;
  name: string;
  url: string;
  iconURL: string;
}

// Pre-defined user constants.
export const usr: { user: User; admin: User; admin2: User; user2: User } = {
  admin: { id: '2t', name: 'ADMIN', url: '/u/2t', iconURL: '/res/avatars/2t/50_admin.png' },
  user: { id: '2u', name: 'USER', url: '/u/2u', iconURL: '/res/avatars/2u/50_user.png' },
  admin2: { id: '2v', name: 'ADMIN2', url: '/u/2v', iconURL: '/res/avatars/2v/50_admin2.png' },
  user2: { id: '2w', name: 'USER2', url: '/u/2w', iconURL: '/res/avatars/2w/50_user2.png' },
};

// Pre-defined error codes.
export const errorCodes = {
  generic: 10000,
  notAuthorized: 10001,
  resNotFound: 10005,
};

// Pre-defined API error results.
export const errorResults = {
  notAuthorized: { code: errorCodes.notAuthorized },
  rowNotUpdated: { code: errorCodes.generic, msg: 'Expected 1 rows affected, got 0.' },
  resNotFound: { code: errorCodes.resNotFound, msg: 'Resource not found' },
};

export type APICallback = (r: APIResult) => Promise<unknown>;

export interface APIOptions {
  body?: unknown;
  cookies?: string;
  respCb?: (resp: Response) => void;
  setCookiesCb?: (cookies: string[] | undefined) => void;
}

function checkAPISuccess(res: APIResult, url: string) {
  if (res.code) {
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

// Sends a login request and returns session cookies.
export async function requestLogin(id: string): Promise<string> {
  const url = apiAuth.in_;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const response = await startFetch(url, {
    uid: id,
  });

  const res = await apiResultFromResponse(response, url);
  checkAPISuccess(res, url);

  const cookies = getSetCookies(response);
  if (!cookies) {
    throw new Error(emptyCookieErr);
  }
  // There mustn't be more than 1 cookies.
  if (cookies.length > 1) {
    throw new Error(`Unexpected cookies: ${JSON.stringify(cookies)} from login API`);
  }
  if (!cookies[0]) {
    throw new Error(emptyCookieErr);
  }
  return cookies[0];
}

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
      cookie: opt?.cookies ?? '',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} from URL ${url}`);
  }
  opt?.respCb?.(response);
  if (opt?.setCookiesCb) {
    opt.setCookiesCb(getSetCookies(response));
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
  let cookies: string | undefined;
  if (user) {
    cookies = await requestLogin(user.id);
  } else {
    cookies = opt?.cookies;
  }
  const response = await startFetch(url, body, { ...opt, cookies });
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
