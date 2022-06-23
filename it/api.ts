/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { call, APIResult, CallOptions, User, errorResults } from 'base/call';
import test from 'node:test';
import * as assert from 'node:assert';

// Re-exports.
export * from 'base/call';

// `it` for APIs (aka `ita`).
export function ita(
  name: string,
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  handler: (d: APIResult) => Promise<void> | void,
  callOpt?: CallOptions,
) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  test(name, async () => {
    const d = await call(url, body, user, callOpt);
    return handler(d);
  });
}

// Calls `ita` and checks API results.
export function itaResult(
  name: string,
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  apiResult: APIResult,
  callOpt?: CallOptions,
) {
  // eslint-disable-next-line no-param-reassign
  callOpt ??= {};
  // eslint-disable-next-line no-param-reassign
  callOpt.ignoreAPIError = true;
  return ita(
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

// Calls `itaResult` and checks the result is `errorResults.notAuthorized`.
export function itaNotAuthorized(
  name: string,
  url: string,
  user: User | null,
  callOpt?: CallOptions,
) {
  return itaResult(name, url, null, user, errorResults.notAuthorized, callOpt);
}
