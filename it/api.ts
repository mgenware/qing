/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as assert from 'node:assert';
import { api, apiRaw, APIResult, APIOptions, User, errorResults } from 'base/api.js';

// Re-exports.
export * from 'base/api.js';

export function itaRaw(
  name: string,
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  handler: (d: APIResult) => Promise<void> | void,
  callOpt?: APIOptions,
) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  it(name, async () => {
    const d = await apiRaw(url, body, user, callOpt);
    return handler(d);
  });
}

export function ita<T>(
  name: string,
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  handler: (d: T) => Promise<void> | void,
  callOpt?: APIOptions,
) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  it(name, async () => {
    const d = await api<T>(url, body, user, callOpt);
    return handler(d);
  });
}

// Calls `itaRaw` and checks API results.
export function itaResultRaw(
  name: string,
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  apiResult: APIResult,
  callOpt?: APIOptions,
) {
  return itaRaw(
    name,
    url,
    body,
    user,
    (r) => {
      assert.deepStrictEqual(r, apiResult);
    },
    callOpt,
  );
}

// Calls `ita` and checks API results.
export function itaResult<T>(
  name: string,
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  result: T,
  callOpt?: APIOptions,
) {
  return ita<T>(
    name,
    url,
    body,
    user,
    (r) => {
      assert.deepStrictEqual(r, result);
    },
    callOpt,
  );
}

// Calls `itaResult` and checks the result is `errorResults.notAuthorized`.
export function itaNotAuthorized(
  name: string,
  url: string,
  user: User | null,
  callOpt?: APIOptions,
) {
  return itaResultRaw(name, url, null, user, errorResults.notAuthorized, callOpt);
}
