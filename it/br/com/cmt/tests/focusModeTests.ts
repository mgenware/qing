/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import * as def from 'base/def';
import * as cm from './common';
import * as act from './actions';
import * as cps from 'br/com/editing/composer';

function testCreateCore(w: CmtFixtureWrapper) {
  w.test(`Create and view a reply, default ordering, expander state`, usr.user, async ({ p }) => {
    {
      {
        // Create 2 cmts and a reply.
        const cmtApp = await w.getCmtApp(p);
        for (let i = 0; i < 2; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeCmt(p, {
            cmtApp,
            content: def.sd.content,
          });
        }
        const cmtEl = cm.getTopCmt({ cmtApp });
        await act.writeReply(p, {
          cmtEl,
          content: def.sd.content,
        });
      }
      {
        // Visitor.
        await p.reload(null);
        const cmtApp = await w.getCmtApp(p);
        const cmtEl = cm.getTopCmt({ cmtApp });

        // Replies should be hidden.
        await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 0 });
        await cm.shouldNotHaveReplies(cmtEl);
        // Click replies.
        await act.clickRepliesButton({ cmtEl, replyCount: 1 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          author: usr.user,
          content: def.sd.content,
        });
        // 2: 1 reply + 1 parent cmt.
        await cm.shouldHaveCmtCount({ cmtApp, count: 2 });
        await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 1 });
      }
    }
  });
}

export default function testCreate(w: CmtFixtureWrapper) {
  testCreateCore(w, true);
  testCreateCore(w, false);
  testCreateWithPagination(w);
  testCreateWithDedup(w);
}
