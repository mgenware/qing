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
import { editorShouldAppear } from 'br/com/editor/editor';

function testCreateReplyCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test(
    `Create and view a ${fresh ? 'fresh ' : ''}reply, expander state`,
    usr.user,
    async ({ page }) => {
      {
        {
          // User 1.
          let cmtApp = await w.getCmtApp(page);
          await act.writeCmt(page, {
            cmtApp,
            content: def.sd.content,
          });
          const cmtEl = cm.getTopCmt(cmtApp);
          await act.writeReply(page, {
            cmtEl,
            content: def.sd.content,
            shownCb: async () => {
              await editorShouldAppear(page, {
                name: 'Reply to USER',
                title: null,
                contentHTML: '',
                buttons: [{ text: 'Send', style: 'success' }, { text: 'Cancel' }],
              });
            },
          });
          // 2: 1 reply + 1 parent cmt.
          await cm.shouldHaveCmtCount(cmtApp, 2);

          if (!fresh) {
            await page.reload();
            cmtApp = await w.getCmtApp(page);

            // Replies should be hidden after reloading.
            await cm.shouldHaveReplyCount(cmtEl, false, 1);
            await cm.shouldNotHaveReplies(cm.getTopCmt(cmtApp));
            // Click replies.
            await act.clickRepliesButton(cm.getTopCmt(cmtApp));
          } else {
            // Replies are shown for refresh reply.
            await cm.shouldHaveReplyCount(cmtEl, true, 1);
          }

          await cm.cmtShouldAppear(cm.getNthReplyFromTopCmt(cmtApp, 0), {
            author: usr.user,
            content: def.sd.content,
            highlighted: fresh,
            canEdit: true,
          });
          // 2: 1 reply + 1 parent cmt.
          await cm.shouldHaveCmtCount(cmtApp, 2);
          await cm.shouldHaveReplyCount(cm.getTopCmt(cmtApp), true, 1);
        }
        {
          // Visitor.
          await page.reload(null);
          const cmtApp = await w.getCmtApp(page);
          const cmtEl = cm.getTopCmt(cmtApp);

          // Replies should be hidden.
          await cm.shouldHaveReplyCount(cmtEl, false, 1);
          await cm.shouldNotHaveReplies(cmtEl);
          // Click replies.
          await act.clickRepliesButton(cmtEl);

          await cm.cmtShouldAppear(cm.getNthReplyFromTopCmt(cmtApp, 0), {
            author: usr.user,
            content: def.sd.content,
          });
          // 2: 1 reply + 1 parent cmt.
          await cm.shouldHaveCmtCount(cmtApp, 2);
          await cm.shouldHaveReplyCount(cmtEl, true, 1);
        }
      }
    },
  );
}

function testCreateRepliesAndPagination(w: CmtFixtureWrapper) {
  w.test('Create replies, pagination', usr.user, async ({ page }) => {
    {
      {
        // User 1.
        const cmtApp = await w.getCmtApp(page);
        await act.writeCmt(page, {
          cmtApp,
          content: def.sd.content,
        });
        const cmtEl = cm.getTopCmt(cmtApp);
        const total = 3;
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeReply(page, { cmtEl, content: `${i + 1}`, waitForTimeChange: true });
        }
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await cm.cmtShouldAppear(cm.getNthReplyFromTopCmt(cmtEl, i), {
            author: usr.user,
            content: `${3 - i}`,
            highlighted: true,
            canEdit: true,
          });
        }
        // + 1: 1 extra top cmt.
        await cm.shouldHaveCmtCount(cmtApp, total + 1);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);
        const cmtEl = cm.getTopCmt(cmtApp);

        // 3 replies + 1 parent cmt.
        await cm.shouldHaveCmtCount(cmtApp, 4);

        // Replies should be hidden.
        await cm.shouldNotHaveReplies(cmtEl);
        // Click replies.
        await act.clickRepliesButton(cmtEl);

        await cm.cmtShouldAppear(cm.getNthReplyFromTopCmt(cmtEl, 0), {
          author: usr.user,
          content: '3',
        });
        await cm.cmtShouldAppear(cm.getNthReplyFromTopCmt(cmtEl, 1), {
          author: usr.user,
          content: '2',
        });
        await act.clickMoreCmt(cmtApp);

        await cm.cmtShouldAppear(cm.getNthReplyFromTopCmt(cmtEl, 2), {
          author: usr.user,
          content: '1',
        });
      }
    }
  });
}

export default function testCreateReply(w: CmtFixtureWrapper) {
  testCreateReplyCore(w, true);
  testCreateReplyCore(w, false);
  testCreateRepliesAndPagination(w);
}
