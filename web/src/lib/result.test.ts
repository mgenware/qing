/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'qing-t';
import ErrorWithCode from './errorWithCode';
import Result from './result';

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
