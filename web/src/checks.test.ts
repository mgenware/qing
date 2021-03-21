/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { expect } from 'qing-t';
import { CHECK } from './checks';

it('Check ignored in prod mode', () => {
  expect(() => CHECK(0)).to.not.throw();
});

it('Check failed', () => {
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__qing_dev__ = true;
    CHECK(0);
  }).to.throw('Assertion failed');
});
