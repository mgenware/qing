/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as eb from 'br/cm/editing/editBar.js';
import * as alt from 'br/cm/overlays/alert.js';
import * as def from 'base/def.js';
import * as cm from '../common.js';
import { writeCmt } from '../actions.js';

function testDeleteCore(w: cm.CmtFixtureWrapper, fresh: boolean) {
  w.test('Delete a cmt' + (fresh ? ' fresh' : ''), { viewer: usr.user }, async ({ p }) => {
    {
      {
        let cmtApp = await w.getCmtApp(p);
        await writeCmt(p, { cmtApp, content: def.sd.content });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
        }

        // Delete the comment.
        await eb.getDeleteButton(cm.getNthCmt({ cmtApp, index: 0 }), usr.user.id).click();
        const dialog = await alt.waitFor(p, {
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
        await p.reload(null);
        const cmtApp = await w.getCmtApp(p);
        await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
      }
    }
  });
}

export default function testDelete(w: cm.CmtFixtureWrapper) {
  testDeleteCore(w, true);
  testDeleteCore(w, false);
}
