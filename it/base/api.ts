/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */
import { runTask } from './runner';
import { postInputToOptions, post, PostInput, User, APIResult } from './post';

export * as ass from './ass';
export * as assUtil from './assUtil';
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

export async function itPost(
  itInput: ItInput,
  postInput: PostInput,
  user: User | null,
  handler: (d: APIResult) => Promise<void>,
) {
  return it(itInput, async () => {
    const opts = postInputToOptions(postInput);
    const d = await post({ ...opts, user: user ?? undefined });
    await handler(d);
  });
}
