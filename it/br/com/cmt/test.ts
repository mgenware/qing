/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixture } from './fixture';
import { CmtFixtureWrapper } from './tests/common';

// Individual tests.
import testNoCmts from './tests/noCmtTests';
import testCreateCmt from './tests/createCmtTests';
import testEditCmt from './tests/editCmtTests';
import testDeleteCmt from './tests/deleteCmtTests';
import testCreateReply from './tests/createReplyTests';

export default function testCmt(groupName: string, fixture: CmtFixture) {
  const w = new CmtFixtureWrapper(groupName, fixture);
  testNoCmts(w);
  testCreateCmt(w);
  testCreateReply(w);
  testEditCmt(w);
  testDeleteCmt(w);
}
