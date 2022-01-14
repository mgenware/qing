/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { performUpdateEditor } from 'br/com/editor/performers';
import * as defs from 'base/defs';
import * as cm from './common';
import { performWriteComment } from './performers';

function testEditCmtCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test('Edit a cmt' + (fresh ? ' - Fresh' : ''), usr.user, async ({ page }) => {
    {
      {
        let cmtApp = await w.getCmtApp(page);
        await performWriteComment(page, { cmtApp, content: defs.sd.content }, true);

        if (!fresh) {
          await page.reload();
          cmtApp = await w.getCmtApp(page);
        }

        // Edit the comment.
        await getEditBarEditButton(cm.getNthCmt(cmtApp, 0), usr.user.id).click();
        await performUpdateEditor(page, { part: 'content' });
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: defs.sd.updated,
          highlighted: fresh,
          canEdit: true,
          hasEdited: true,
        });
        await cm.shouldHaveComments(cmtApp, 1);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: defs.sd.updated,
          hasEdited: true,
        });
        await cm.shouldHaveComments(cmtApp, 1);
      }
    }
  });
}

export default function testEditCmt(w: CmtFixtureWrapper) {
  testEditCmtCore(w, true);
  testEditCmtCore(w, false);
}
