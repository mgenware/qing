/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'dev/t.js';
import { CHECK } from './checks.js';

it('CHECK ignored in prod mode', () => {
  expect(() => CHECK(0)).to.not.throw();
});

it('CHECK failed', () => {
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__qing_dev__ = true;
    CHECK(0);
  }).to.throw('Assertion failed');
});
