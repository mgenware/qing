/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { runTask } from './runner';
import { post, APIResult, PostParams, User, errorResults } from './post';
import * as ass from './ass';

export * as ass from './ass';
export * from './post';

export interface ItOptions {
  name: string;
  queue?: string;
}

export type ItInput = string | ItOptions;

export async function it(input: ItInput, handler: () => Promise<unknown>) {
  const opts = typeof input === 'string' ? { name: input } : input;
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
  postParams: PostParams | null,
  ignoreAPIResultErrors: boolean,
  handler: (d: APIResult) => Promise<void> | void,
) {
  return it(itInput, async () => {
    const p = postParams ?? {};
    p.ignoreAPIResultErrors = ignoreAPIResultErrors;
    if (user != null) {
      p.user = user;
    }
    const d = await post(url, p);
    return handler(d);
  });
}

export async function ita(
  itInput: ItInput,
  url: string,
  user: User | null,
  postParams: PostParams | null,
  handler: (d: APIResult) => Promise<void> | void,
) {
  return itaCore(itInput, url, user, postParams, false, handler);
}

export async function itaResult(
  itInput: ItInput,
  url: string,
  user: User | null,
  postParams: PostParams | null,
  apiResult: APIResult,
) {
  return itaCore(itInput, url, user, postParams, true, (r) => {
    ass.de(r, apiResult);
  });
}

export async function itaNotAuthorized(
  itInput: ItInput,
  url: string,
  user: User | null,
  postParams: PostParams | null,
) {
  return itaResult(itInput, url, user, postParams, errorResults.notAuthorized);
}
