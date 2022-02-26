/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as apiAuth from '@qing/routes/d/dev/api/auth';
import { serverURL } from './defs';
import fetch, { Response } from 'node-fetch';

const emptyCookieErr = 'Unexpected empty cookies from login API';

// The result of an API call.
export interface APIResult {
  code?: number;
  message?: string;
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
  rowNotUpdated: { code: errorCodes.generic, message: 'Expected 1 rows affected, got 0.' },
  resNotFound: { code: errorCodes.resNotFound, message: 'Resource not found' },
};

export type CallCallback = (r: APIResult) => Promise<unknown>;

export interface CallCoreOptions {
  body?: unknown;
  cookies?: string;
  ignoreAPIError?: boolean;
}

// `cookies` field is used internally to track login status.
export type CallOptions = Omit<CallCoreOptions, 'cookies'>;

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
async function requestLogin(id: string): Promise<string> {
  const url = apiAuth.in_;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const response = await callCore(url, {
    uid: id,
  });

  const res = await apiResultFromResponse(response, url);
  checkAPISuccess(res, url);

  const cookies = response.headers.raw()['set-cookie'];
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
async function callCore(
  url: string,
  body: Record<string, unknown> | null,
  opt?: CallCoreOptions,
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
  return response;
}

// Initiates an API call with the given params.
export async function call(
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  opt?: CallOptions,
): Promise<APIResult> {
  let cookies = '';
  if (user !== null) {
    cookies = await requestLogin(user.id);
  }
  const response = await callCore(url, body, { ...opt, cookies });
  const apiRes = await apiResultFromResponse(response, url);
  if (!opt?.ignoreAPIError) {
    checkAPISuccess(apiRes, url);
  }
  return apiRes;
}
