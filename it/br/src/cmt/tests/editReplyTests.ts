/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as def from 'base/def.js';
import * as cm from '../common.js';
import * as act from '../actions.js';
import * as cps from 'br/cm/editing/composer.js';
import { CmtFixture } from '../fixture.js';
import { Page } from '@playwright/test';

export function testEditReply(w: CmtFixture, page: Page, fresh: boolean) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      {
        let cmtApp = await w.getCmtApp(p);
        await act.writeCmt(p, { cmtApp, content: def.sd.content });
        let cmtEl = cm.getTopCmt({ cmtApp });
        await act.writeReply(p, { cmtEl, content: def.sd.content, date: def.oldDate });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
          cmtEl = cm.getTopCmt({ cmtApp });
          await act.clickRepliesButton({ cmtEl, replyCount: 1 });
        }

        // Edit the reply.
        await act.editCmt(p, {
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
          waitForLitUpdate: true,
        });

        await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 1 });
        await cm.shouldHaveCmtCount({ cmtApp, count: 2 });
      }
      {
        // Visitor.
        await p.reloadWithUser(null);
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
