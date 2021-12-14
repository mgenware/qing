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

export interface ItOptions {
  name: string;
  queue?: string;
}

export type ItInput = string | ItOptions;

export async function it(input: ItInput, handler: () => Promise<unknown>) {
  const opts = typeof input === 'string' ? { name: input } : input;
  if (globalContext.nameFilter) {
    if (!opts.name?.includes(globalContext.nameFilter)) {
      return;
    }
  }
  if (!opts.name) {
    throw new Error('Unnamed test');
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }
  await runTask(opts.name, handler, opts.queue);
}

export async function itaCore(
  itInput: ItInput,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  ignoreAPIResultErrors: boolean,
  handler: (d: APIResult) => Promise<void> | void,
) {
  return it(itInput, async () => {
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
  itInput: ItInput,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  handler: (d: APIResult) => Promise<void> | void,
) {
  return itaCore(itInput, url, user, callParams, false, handler);
}

export async function itaResult(
  itInput: ItInput,
  url: string,
  user: User | null,
  callParams: CallParams | null,
  apiResult: APIResult,
) {
  return itaCore(itInput, url, user, callParams, true, (r) => {
    ass.de(r, apiResult);
  });
}

export async function itaNotAuthorized(
  itInput: ItInput,
  url: string,
  user: User | null,
  callParams: CallParams | null,
) {
  return itaResult(itInput, url, user, callParams, errorResults.notAuthorized);
}
