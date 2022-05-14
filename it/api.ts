/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { call, APIResult, CallOptions, User, errorResults } from 'base/call';
import * as m from 'mocha';
import { expect } from 'expect';

// Re-exports.
export * from 'base/call';
export { expect } from 'expect';
export { it } from 'mocha';

// `it` for APIs (aka `ita`).
export function ita(
  name: string,
  url: string,
  body: Record<string, unknown> | null,
  user: User | null,
  handler: (d: APIResult) => Promise<void> | void,
  callOpt?: CallOptions,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  m.it(name, async () => {
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
      expect(r).toEqual(apiResult);
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
