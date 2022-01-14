/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import { getEditBarDeleteButton } from 'br/com/editor/editBar';
import { alertShouldAppear, AlertType, AlertButtons } from 'br/com/alerts/alert';
import * as defs from 'base/defs';
import * as cm from './common';
import { writeCmt } from './actions';

function testDeleteCmtCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test('Delete a cmt' + (fresh ? ' (fresh)' : ''), usr.user, async ({ page }) => {
    {
      {
        let cmtApp = await w.getCmtApp(page);
        await writeCmt(page, { cmtApp, content: defs.sd.content }, true);

        if (!fresh) {
          await page.reload();
          cmtApp = await w.getCmtApp(page);
        }

        // Delete the comment.
        await getEditBarDeleteButton(cm.getNthCmt(cmtApp, 0), usr.user.id).click();
        const alertBtns = await alertShouldAppear(page, {
          content: 'Do you want to delete this comment?',
          type: AlertType.warning,
          buttons: AlertButtons.YesNo,
          focusedBtn: 1,
        });
        await alertBtns.item(0).click();
        await cm.shouldHaveComments(cmtApp, 0);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);
        await cm.shouldHaveComments(cmtApp, 0);
      }
    }
  });
}

export default function testDeleteCmt(w: CmtFixtureWrapper) {
  testDeleteCmtCore(w, true);
  testDeleteCmtCore(w, false);
}
