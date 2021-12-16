/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { runTask } from './runner';
import { call, APIResult, CallParams, User, errorResults } from './call';
import * as ass from './ass';
import globalContext from './globalContext';

export * as ass from './ass';
export * from './call';

export async function it(name: string, handler: () => Promise<unknown>) {
  if (globalContext.nameFilter) {
    if (!name.includes(globalContext.nameFilter)) {
      return;
    }
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }
  await runTask(name, handler);
}

export async function itaCore(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  ignoreAPIResultErrors: boolean,
  handler: (d: APIResult) => Promise<void> | void,
) {
  return it(name, async () => {
    const p = callParams ?? {};
    p.ignoreAPIResultErrors = ignoreAPIResultErrors;
    if (user != null) {
      p.user = user;
    }
    const d = await call(url, p);
    return handler(d);
  });
}

export async function ita(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  handler: (d: APIResult) => Promise<void> | void,
) {
  return itaCore(name, url, user, callParams, false, handler);
}

export async function itaResult(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  apiResult: APIResult,
) {
  return itaCore(name, url, user, callParams, true, (r) => {
    ass.de(r, apiResult);
  });
}

export async function itaNotAuthorized(
  name: string,
  url: string,
  user: User | null,
  callParams: CallParams | null,
) {
  return itaResult(name, url, user, callParams, errorResults.notAuthorized);
}
