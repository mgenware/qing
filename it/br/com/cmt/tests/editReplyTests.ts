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
import { writeCmt, editCmt } from './actions';
import * as act from './actions';
import * as cps from 'br/com/editing/composer';

function testEditCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test(`Edit a reply - ${fresh ? 'Fresh' : 'Not fresh'}`, usr.user, async ({ p }) => {
    {
      {
        let cmtApp = await w.getCmtApp(p);
        await writeCmt(p, { cmtApp, content: def.sd.content });
        let cmtEl = cm.getTopCmt({ cmtApp });
        await act.writeReply(p, { cmtEl, content: def.sd.content });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
          cmtEl = cm.getTopCmt({ cmtApp });
          await act.clickRepliesButton({ cmtEl, replyCount: 1 });
        }

        // Edit the reply.
        await editCmt(p, {
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          content: def.sd.updated,
          author: usr.user,
          shownCb: async (overlayEl) => {
            await cps.shouldAppear(overlayEl, {
              name: 'Edit comment',
              title: null,
              contentHTML: def.sd.contentViewHTML,
            });
          },
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          author: usr.user,
          content: def.sd.updated,
          highlighted: fresh,
          canEdit: true,
          hasEdited: true,
        });

        await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 1 });
        await cm.shouldHaveCmtCount({ cmtApp, count: 2 });
      }
      {
        // Visitor.
        await p.reload(null);
        const cmtApp = await w.getCmtApp(p);

        const cmtEl = cm.getTopCmt({ cmtApp });
        await act.clickRepliesButton({ cmtEl, replyCount: 1 });

        await cm.shouldAppear({
          cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
          author: usr.user,
          content: def.sd.updated,
          hasEdited: true,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 2 });
      }
    }
  });
}

export default function testEdit(w: CmtFixtureWrapper) {
  testEditCore(w, true);
  testEditCore(w, false);
}
