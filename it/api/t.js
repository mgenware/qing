/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */
import { runTask } from '../runner.js';
import { postInputToOptions, post } from '../common.js';

// Re-exports.
export * as ass from '../ass.js';
export { usr, post } from '../common.js';
export * as assUtil from './assUtil.js';

/**
 * @typedef {Object} ItOptions
 * @property {string} name
 * @property {string} queue
 *
 * @typedef {string|ItOptions} ItInput
 */

/**
 * @param {ItInput} intput
 * @param {PostCallback} handler
 * @returns {Promise<APIResult>}
 */
export async function it(input, handler) {
  const opts = typeof input === 'string' ? { name: input } : input;
  if (!opts.name) {
    throw new Error('Unnamed test');
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }
  await runTask(opts.name, handler, opts.queue);
}

/**
 * @param {ItInput} itInput
 * @param {PostInput} input
 * @param {Object} user
 * @param {PostCallback} handler
 * @returns {Promise<Object>}
 */
export async function itPost(itInput, input, user, handler) {
  return it(itInput, async () => {
    const opts = postInputToOptions(input);
    const d = await post({ ...opts, user });
    await handler(d);
  });
}
