/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import * as eb from 'br/com/editing/editBar';
import * as alt from 'br/com/overlays/alert';
import * as def from 'base/def';
import * as cm from './common';
import { writeCmt } from './actions';

function testDeleteCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test('Delete a cmt' + (fresh ? ' fresh' : ''), usr.user, async ({ page }) => {
    {
      {
        let cmtApp = await w.getCmtApp(page);
        await writeCmt(page, { cmtApp, content: def.sd.content });

        if (!fresh) {
          await page.reload();
          cmtApp = await w.getCmtApp(page);
        }

        // Delete the comment.
        await eb.getDeleteButton(cm.getNthCmt({ cmtApp, index: 0 }), usr.user.id).click();
        const dialog = await alt.waitFor(page, {
          content: 'Do you want to delete this comment?',
          type: alt.AlertType.warning,
          buttons: alt.AlertButtons.YesNo,
          focusedBtn: 1,
        });
        await dialog.clickYes();
        await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);
        await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
      }
    }
  });
}

export default function testDelete(w: CmtFixtureWrapper) {
  testDeleteCore(w, true);
  testDeleteCore(w, false);
}
