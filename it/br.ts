/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

// Re-exports.
export { expect, Expect } from 'brt';
export { usr, call, User } from 'base/call';

export type HandlerType = (page: brt.Page) => Promise<void>;

export function test(name: string, handler: HandlerType) {
  return brt.test(name, ({ page }) => handler(new brt.Page(page)));
}

export function beforeEach(handler: HandlerType) {
  return brt.test.beforeEach(({ page }) => handler(new brt.Page(page)));
}

export function beforeAll(handler: HandlerType) {
  return brt.test.beforeAll(({ page }) => handler(new brt.Page(page)));
}

export function afterEach(handler: HandlerType) {
  return brt.test.afterEach(({ page }) => handler(new brt.Page(page)));
}

export function afterAll(handler: HandlerType) {
  return brt.test.afterAll(({ page }) => handler(new brt.Page(page)));
}
