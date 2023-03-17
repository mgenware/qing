/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'dev/t.js';
import ErrorWithCode from './errorWithCode.js';
import Result from './result.js';

it('Data', () => {
  const r = Result.data(123);
  expect(r.data).to.eq(123);
  expect(r.isSuccess).eq(true);
});

it('Data', () => {
  const r = Result.error(new ErrorWithCode('haha'));
  expect(r.data).to.eq(null);
  expect(r.error?.message).to.eq('haha');
  expect(r.isSuccess).eq(false);
});
