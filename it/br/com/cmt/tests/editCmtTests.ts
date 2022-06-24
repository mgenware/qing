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
import { editorShouldAppear } from 'br/com/editor/editor';

function testEditCmtCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test(`Edit a cmt - ${fresh ? 'Fresh' : 'Not fresh'}`, usr.user, async ({ page }) => {
    {
      {
        let cmtApp = await w.getCmtApp(page);
        await writeCmt(page, { cmtApp, content: def.sd.content });

        if (!fresh) {
          await page.reload();
          cmtApp = await w.getCmtApp(page);
        }

        // Edit the comment.
        await editCmt(page, {
          cmtApp,
          author: usr.user,
          shownCb: async () => {
            await editorShouldAppear(page, {
              name: 'Edit comment',
              title: null,
              contentHTML: def.sd.contentHTML,
              buttons: [{ text: 'Save', style: 'success' }, { text: 'Cancel' }],
            });
          },
        });
        await cm.cmtShouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: def.sd.updated,
          highlighted: fresh,
          canEdit: true,
          hasEdited: true,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);

        await cm.cmtShouldAppear({
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

export default function testEditCmt(w: CmtFixtureWrapper) {
  testEditCmtCore(w, true);
  testEditCmtCore(w, false);
}
