/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'dev/t';
import ErrorWithCode from './errorWithCode';

it('ErrorWithCode: customized code', () => {
  const err = new ErrorWithCode('hi', 123);
  expect(err.message).to.eq('hi');
  expect(err.code).to.eq(123);
});

it('ErrorWithCode: default code', () => {
  const err = new ErrorWithCode('hi');
  expect(err.message).to.eq('hi');
  expect(err.code).to.eq(10000);
});
