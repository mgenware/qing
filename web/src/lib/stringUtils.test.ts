/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { expect } from 'qing-t';
import { splitLocalizedString } from './stringUtils';

it('splitLocalizedString', () => {
  expect(splitLocalizedString('a||b||c')).to.deep.eq(['a', 'b', 'c']);
});
