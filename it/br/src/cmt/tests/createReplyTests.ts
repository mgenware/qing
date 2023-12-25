/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as def from '@qing/dev/it/base/def.js';
import * as cm from '../common.js';
import * as act from '../actions.js';
import * as cps from 'cm/editing/composer.js';
import { CmtFixture } from '../fixture.js';
import { Page } from '@playwright/test';

export function testCreateReplies(w: CmtFixture, page: Page, fresh: boolean) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      {
        // User 1.
        let cmtApp = await w.getCmtApp(p);
        await act.writeCmt(p, {
          cmtApp,
          content: def.sd.content,
        });
        let cmtEl = cm.getTopCmt({ cmtApp });
        await act.writeReply(p, {
          cmtEl,
          content: def.sd.content,
          shownCb: async (overlayEl) => {
            await cps.shouldAppear(overlayEl, {
              name: 'Reply to USER',
              title: null,
              contentHTML: '',
            });
          },
        });
        // 2: 1 reply + 1 parent cmt.
        await cm.shouldHaveCmtCount({ cmtApp, count: 2 });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
          cmtEl = cm.getTopCmt({ cmtApp });

          // Replies should be hidden after reloading.
          await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 0 });
          await cm.shouldNotHaveReplies(cm.getTopCmt({ cmtApp }));
          // Click replies.
          await act.clickRepliesButton({ cmtEl: cm.getTopCmt({ cmtApp }), replyCount: 1 });
        } else {
          // Replies are shown for refresh reply.
          await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 1 });
        }

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          author: usr.user,
          content: def.sd.content,
          highlighted: fresh,
          canEdit: true,
        });
        // 2: 1 reply + 1 parent cmt.
        await cm.shouldHaveCmtCount({ cmtApp, count: 2 });
        await cm.shouldHaveReplyCount({ cmtEl: cm.getTopCmt({ cmtApp }), count: 1, shown: 1 });
      }
      {
        // Visitor.
        await p.reloadWithUser(null);
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

export function testCreateRepliesWithPagination(w: CmtFixture, page: Page) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      const total = 5;
      {
        // User 1.
        const cmtApp = await w.getCmtApp(p);
        await act.writeCmt(p, {
          cmtApp,
          content: def.sd.content,
        });
        const datePrefix = '2006-12-';
        const cmtEl = cm.getTopCmt({ cmtApp });
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeReply(p, {
            cmtEl,
            content: `${i + 1}`,
            date: new Date(`${datePrefix}${i + 1}`),
          });
        }
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await cm.shouldAppear({
            cmtEl: cm.getNthReply({ cmtEl, index: i }),
            author: usr.user,
            content: `${total - i}`,
            highlighted: true,
            canEdit: true,
          });
        }
        // + 1 extra top cmt.
        await cm.shouldHaveCmtCount({ cmtApp, count: total + 1 });
        await cm.shouldHaveReplyCount({ cmtEl, count: total, shown: total });
      }
      {
        // Visitor.
        await p.reloadWithUser(null);
        const cmtApp = await w.getCmtApp(p);
        const cmtEl = cm.getTopCmt({ cmtApp });

        // + 1 extra root cmt.
        await cm.shouldHaveCmtCount({ cmtApp, count: total + 1 });

        // Replies should be collapsed.
        await cm.shouldNotHaveReplies(cmtEl);
        // Click replies.
        await act.clickRepliesButton({ cmtEl, replyCount: total });

        // Cmt should have 5 replies with 2 shown.
        await cm.shouldHaveReplyCount({ cmtEl, count: total, shown: 2 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          author: usr.user,
          content: '5',
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 1 }),
          author: usr.user,
          content: '4',
        });

        // Click more replies.
        await act.clickMoreReplies({ cmtEl });

        // Cmt should have 5 replies with 4 shown.
        await cm.shouldHaveReplyCount({ cmtEl, count: total, shown: 4 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 2 }),
          author: usr.user,
          content: '3',
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 3 }),
          author: usr.user,
          content: '2',
        });

        // Click more replies.
        await act.clickMoreReplies({ cmtEl });

        // All 5 replies are shown.
        await cm.shouldHaveReplyCount({ cmtEl, count: total, shown: 5 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 4 }),
          author: usr.user,
          content: '1',
        });
      }
    }
  });
}

// Forked from `testCreateRepliesPagination`.
// Tests creating replies while loading more pages. Duplicates should not happen.
export function testCreateRepliesWithDedup(w: CmtFixture, page: Page) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      const total = 5;
      {
        // Setup predefined replies.
        const cmtApp = await w.getCmtApp(p);
        await act.writeCmt(p, {
          cmtApp,
          content: def.sd.content,
        });
        const cmtEl = cm.getTopCmt({ cmtApp });

        const datePrefix = '2006-12-';
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeReply(p, {
            cmtEl,
            content: `${i + 1}`,
            date: new Date(`${datePrefix}${i + 1}`),
          });
        }
        // + 1 extra top cmt.
        await cm.shouldHaveCmtCount({ cmtApp, count: total + 1 });
        await cm.shouldHaveReplyCount({ cmtEl, count: total, shown: total });
      }
      {
        await p.reload();
        const cmtApp = await w.getCmtApp(p);
        const cmtEl = cm.getTopCmt({ cmtApp });

        // By default, replies are collapsed with a link button (5 replies).
        await act.clickRepliesButton({ cmtEl, replyCount: total });

        // Create a reply with "more replies" never clicked.
        await act.writeReply(p, { cmtEl, content: 'new 1' });

        await cm.shouldHaveCmtCount({ cmtApp, count: total + 2 });
        // 3 replies are shown.
        await cm.shouldHaveReplyCount({ cmtEl, count: total + 1, shown: 3 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          author: usr.user,
          content: 'new 1',
          highlighted: true,
          canEdit: true,
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 1 }),
          author: usr.user,
          content: '5',
          canEdit: true,
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 2 }),
          author: usr.user,
          content: '4',
          canEdit: true,
        });

        // Show more.
        await act.clickMoreReplies({ cmtEl });
        await cm.shouldHaveCmtCount({ cmtApp, count: total + 2 });
        await cm.shouldHaveReplyCount({ cmtEl, count: total + 1, shown: 5 });

        // Create 2 cmts with "more cmts" clicked but not fully loaded.
        await act.writeReply(p, { cmtEl, content: 'new 2' });
        await act.writeReply(p, { cmtEl, content: 'new 3' });

        await cm.shouldHaveCmtCount({ cmtApp, count: total + 4 });
        await cm.shouldHaveReplyCount({ cmtEl, count: total + 3, shown: 7 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          author: usr.user,
          content: 'new 3',
          highlighted: true,
          canEdit: true,
        });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 1 }),
          author: usr.user,
          content: 'new 2',
          highlighted: true,
          canEdit: true,
        });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 2 }),
          author: usr.user,
          content: 'new 1',
          highlighted: true,
          canEdit: true,
        });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 3 }),
          author: usr.user,
          content: '5',
          canEdit: true,
        });

        // Item 4, 3 are skipped.
        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 6 }),
          author: usr.user,
          content: '2',
          canEdit: true,
        });

        // Show more.
        // Pull the last 1 cmt.
        await act.clickMoreReplies({ cmtEl });
        await cm.shouldHaveCmtCount({ cmtApp, count: total + 4 });
        await cm.shouldHaveReplyCount({ cmtEl, count: total + 3, shown: 8 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 7 }),
          author: usr.user,
          content: '1',
          canEdit: true,
        });
      }
    }
  });
}
