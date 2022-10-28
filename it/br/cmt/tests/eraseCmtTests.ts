/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br';
import * as eb from 'br/com/editing/editBar';
import * as alt from 'br/com/overlays/alert';
import * as def from 'base/def';
import * as cm from '../common';
import * as act from '../actions';

function testEraseCore(w: cm.CmtFixtureWrapper, fresh: boolean) {
  w.test('Erase cmts - ' + (fresh ? 'Fresh' : 'Stale'), usr.user, async ({ p }) => {
    {
      {
        // Create 3 nested cmts.
        let cmtApp = await w.getCmtApp(p);
        // Cmt 1.
        await act.writeCmt(p, { cmtApp, content: def.sd.content });
        let cmtEl = cm.getTopCmt({ cmtApp });
        // Reply 1.
        await act.writeReply(p, { cmtEl, content: def.sd.content });
        // Reply 2.
        cmtEl = cm.getNthReply({ cmtEl, index: 0 });
        await act.writeReply(p, { cmtEl, content: def.sd.content });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
          // Load first level replies.
          cmtEl = cm.getTopCmt({ cmtApp });
          await act.clickRepliesButton({ cmtEl, replyCount: 1 });
          // Load second level replies.
          cmtEl = cm.getNthReply({ cmtEl, index: 0 });
          await act.clickRepliesButton({ cmtEl, replyCount: 1 });
        }

        // Delete the first cmt.
        cmtEl = cm.getTopCmt({ cmtApp });
        await eb.getDeleteButton(cmtEl, usr.user.id).click();
        let dialog = await alt.waitFor(p, {
          content: 'Do you want to delete this comment?',
        });
        await dialog.clickYes();
        await cm.shouldAppearDeleted({ cmtEl });

        // Total cmt_count.
        await cm.shouldHaveCmtCount({ cmtApp, count: 3 });

        // Reply should not be affected.
        cmtEl = cm.getNthReply({ cmtEl, index: 0 });
        await cm.shouldAppear({ cmtEl, author: usr.user, content: def.sd.content, canEdit: true });

        // Delete the reply.
        await eb.getDeleteButton(cmtEl, usr.user.id).click();
        dialog = await alt.waitFor(p, {
          content: 'Do you want to delete this comment?',
        });
        await dialog.clickYes();
        await cm.shouldAppearDeleted({ cmtEl });

        await cm.shouldHaveCmtCount({ cmtApp, count: 3 });
      }
      {
        // Visitor.
        await p.reload(null);
        const cmtApp = await w.getCmtApp(p);
        await cm.shouldHaveCmtCount({ cmtApp, count: 3 });

        let cmtEl = cm.getTopCmt({ cmtApp });
        await cm.shouldAppearDeleted({ cmtEl });

        // Load replies.
        await act.clickRepliesButton({ cmtEl, replyCount: 1 });
        cmtEl = cm.getNthReply({ cmtEl, index: 0 });
        await cm.shouldAppearDeleted({ cmtEl });

        // Load replies.
        await act.clickRepliesButton({ cmtEl, replyCount: 1 });
        cmtEl = cm.getNthReply({ cmtEl, index: 0 });
        await cm.shouldAppear({ cmtEl, author: usr.user, content: def.sd.content, canEdit: false });
      }
    }
  });
}

export default function testErase(w: cm.CmtFixtureWrapper) {
  testEraseCore(w, true);
  testEraseCore(w, false);
}
