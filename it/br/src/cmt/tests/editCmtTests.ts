/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as def from '@qing/dev/it/base/def.js';
import * as cm from '../common.js';
import { writeCmt, editCmt } from '../actions.js';
import * as cps from 'cm/editing/composer.js';
import { CmtFixture } from '../fixture.js';
import { Page } from '@playwright/test';

export function testEditCmt(w: CmtFixture, page: Page, fresh: boolean) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      {
        let cmtApp = await w.getCmtApp(p);
        await writeCmt(p, { cmtApp, content: def.sd.content, date: def.oldDate });
        let cmtEl = cm.getTopCmt({ cmtApp });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
          cmtEl = cm.getTopCmt({ cmtApp });
        }

        // Edit the comment.
        await editCmt(p, {
          cmtEl,
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
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: def.sd.updated,
          highlighted: fresh,
          canEdit: true,
          hasEdited: true,
          waitForLitUpdate: true,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
      {
        // Visitor.
        await p.reloadWithUser(null);
        const cmtApp = await w.getCmtApp(p);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: def.sd.updated,
          hasEdited: true,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
    }
  });
}
