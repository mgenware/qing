/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'dev/t';
import { ls, formatLS } from './ls';

it('ls', () => {
  expect(ls.qingLang).to.eq('en');
});

it('formatLS', () => {
  expect(formatLS(ls.pNumOfComments, 0)).to.eq('0 comments');
  expect(formatLS(ls.pNumOfComments, 1)).to.eq('1 comment');
  expect(formatLS(ls.pNumOfComments, 2)).to.eq('2 comments');
});
