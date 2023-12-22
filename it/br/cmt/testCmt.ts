/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixture } from './fixture.js';
import { CmtFixtureWrapper } from './common.js';

// Individual tests.
import testNoCmts from './tests/noCmtTests.js';
import testCreateCmt from './tests/createCmtTests.js';
import testEditCmt from './tests/editCmtTests.js';
import testEditReply from './tests/editReplyTests.js';
import testDeleteCmt from './tests/deleteCmtTests.js';
import testDeleteReply from './tests/deleteReplyTests.js';
import testCreateReply from './tests/createReplyTests.js';
import testDismissAndDiscardChanges from './tests/dismissAndDiscardChangesTests.js';
import testErase from './tests/eraseCmtTests.js';
import testShare from './tests/shareCmtTests.js';
import testFocusMode from './tests/focusModeTests.js';
import testCollapseReplies from './tests/collapseReplies.js';
import testReplyNoti from './tests/notiTests.js';
import testTextOverflow from './tests/textOverflowTests.js';

export default function testCmt(groupName: string, fixture: CmtFixture) {
  const w = new CmtFixtureWrapper(groupName, fixture);
  testNoCmts(w);
  testCreateCmt(w);
  testCreateReply(w);
  testEditCmt(w);
  testEditReply(w);
  testDeleteCmt(w);
  testDeleteReply(w);
  testErase(w);
  testDismissAndDiscardChanges(w);
  testShare(w);
  testFocusMode(w);
  testCollapseReplies(w);
  testReplyNoti(w);
  // TODO: reopen after horizontal scroll issue is fixed.
  // testTextOverflow(w);
}
