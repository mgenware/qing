/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { call, APIResult, CallParams, User, errorResults } from 'base/call';
import * as m from 'mocha';
import expect from 'expect';

// Re-exports.
export * from 'base/call';
export { default as expect } from 'expect';
export { it } from 'mocha';

export function itaCore(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  ignoreAPIResultErrors: boolean,
  handler: (d: APIResult) => Promise<void> | void,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  m.it(name, async () => {
    const p = callParams ?? {};
    p.ignoreAPIResultErrors = ignoreAPIResultErrors;
    if (user != null) {
      p.user = user;
    }
    const d = await call(url, p);
    return handler(d);
  });
}

export function ita(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  handler: (d: APIResult) => Promise<void> | void,
) {
  return itaCore(name, url, user, callParams, false, handler);
}

export function itaResult(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  apiResult: APIResult,
) {
  return itaCore(name, url, user, callParams, true, (r) => {
    expect(r).toEqual(apiResult);
  });
}

export function itaNotAuthorized(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
) {
  return itaResult(name, url, user, callParams, errorResults.notAuthorized);
}
