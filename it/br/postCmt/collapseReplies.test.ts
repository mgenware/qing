/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr, test } from 'br.js';
import * as def from 'base/def.js';
import { fixture, cm, act } from './fixture.js';
import { CmtFixtureEnv } from 'br/cmt/fixture.js';

async function setupEnv(e: CmtFixtureEnv) {
  const cmtApp = await e.getCmtApp();
  await act.writeCmt(e.p, {
    cmtApp,
    content: def.sd.content,
  });
  const cmtEl = cm.getTopCmt({ cmtApp });
  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    await act.writeReply(e.p, { cmtEl, content: `${i + 1}` });
  }
  await e.p.reload();
}

test(
  'Collapse and expand replies',
  cm.fc(fixture, { viewer: usr.user }, async (e) => {
    {
      await setupEnv(e);
      const cmtApp = await e.getCmtApp();
      const cmtEl = cm.getTopCmt({ cmtApp });
      // Click and load replies.
      await act.clickRepliesButton({ cmtEl, replyCount: 3 });
      await cm.shouldHaveReplyCount({ cmtEl, count: 3, shown: 2 });
      // Collapse replies.
      await act.clickRepliesButton({ cmtEl, replyCount: 3, collapse: true });
      await cm.shouldHaveReplyCount({ cmtEl, count: 3, shown: 0 });
      // Expand replies.
      await act.clickRepliesButton({ cmtEl, replyCount: 3 });
      await cm.shouldHaveReplyCount({ cmtEl, count: 3, shown: 2 });
      // Click more replies.
      await act.clickMoreReplies({ cmtEl });
      await cm.shouldHaveReplyCount({ cmtEl, count: 3, shown: 3 });
    }
  }),
);

test(
  'Collapse and expand replies - Add a fresh reply first',
  cm.fc(fixture, { viewer: usr.user }, async (e) => {
    {
      await setupEnv(e);
      const cmtApp = await e.getCmtApp();
      const cmtEl = cm.getTopCmt({ cmtApp });

      // Add a reply before loading replies.
      // Now reply view automatically gets expanded.
      await act.writeReply(e.p, { cmtEl, content: 'new' });
      await cm.shouldHaveReplyCount({ cmtEl, count: 4, shown: 1 });
      // Collapse replies.
      await act.clickRepliesButton({ cmtEl, replyCount: 4, collapse: true });
      await cm.shouldHaveReplyCount({ cmtEl, count: 4, shown: 0 });
      // Expand replies.
      await act.clickRepliesButton({ cmtEl, replyCount: 4 });
      await cm.shouldHaveReplyCount({ cmtEl, count: 4, shown: 1 });
      // Click more replies.
      await act.clickMoreReplies({ cmtEl });
      await cm.shouldHaveReplyCount({ cmtEl, count: 4, shown: 3 });
      // Click more replies.
      await act.clickMoreReplies({ cmtEl });
      await cm.shouldHaveReplyCount({ cmtEl, count: 4, shown: 4 });
      // Collapse all.
      await act.clickRepliesButton({ cmtEl, replyCount: 4, collapse: true });
      await cm.shouldHaveReplyCount({ cmtEl, count: 4, shown: 0 });
    }
  }),
);
