/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixture } from './fixture';
import { CmtFixtureWrapper } from './tests/common';

// Individual tests.
import testNoCmts from './tests/noCmt';
import testCore from './tests/core';

export default function testCmt(groupName: string, fixture: CmtFixture) {
  const w = new CmtFixtureWrapper(groupName, fixture);
  testNoCmts(w);
  testCore(w);
}
