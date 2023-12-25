/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as def from '@qing/dev/it/base/def.js';
import * as cm from '../common.js';
import * as act from '../actions.js';
import { Page } from '@playwright/test';
import { CmtFixture } from '../fixture.js';

async function setupEnv(w: CmtFixture, p: br.Page) {
  const cmtApp = await w.getCmtApp(p);
  await act.writeCmt(p, {
    cmtApp,
    content: def.sd.content,
  });
  const cmtEl = cm.getTopCmt({ cmtApp });
  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    await act.writeReply(p, { cmtEl, content: `${i + 1}` });
  }
  await p.reload();
}

export function testCollapseAndExpandReplies(w: CmtFixture, page: Page) {
  return w.start(page, { viewer: br.usr.user }, async ({ p }) => {
    {
      await setupEnv(w, p);
      const cmtApp = await w.getCmtApp(p);
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
  });
}

export function testAddAndExpandReplies(w: CmtFixture, page: Page) {
  return w.start(page, { viewer: br.usr.user }, async ({ p }) => {
    {
      await setupEnv(w, p);
      const cmtApp = await w.getCmtApp(p);
      const cmtEl = cm.getTopCmt({ cmtApp });

      // Add a reply before loading replies.
      // Now reply view automatically gets expanded.
      await act.writeReply(p, { cmtEl, content: 'new' });
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
  });
}
