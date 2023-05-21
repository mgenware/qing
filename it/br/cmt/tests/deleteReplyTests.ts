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
import * as act from '../actions.js';

function testDeleteCore(w: cm.CmtFixtureWrapper, fresh: boolean) {
  w.test('Delete a reply' + (fresh ? ' fresh' : ''), { viewer: usr.user }, async ({ p }) => {
    {
      {
        let cmtApp = await w.getCmtApp(p);
        await act.writeCmt(p, { cmtApp, content: def.sd.content });
        let cmtEl = cm.getTopCmt({ cmtApp });
        await act.writeReply(p, { cmtEl, content: def.sd.content });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
          cmtEl = cm.getTopCmt({ cmtApp });
          await act.clickRepliesButton({ cmtEl, replyCount: 1 });
        }

        // Delete the reply.
        await eb.getDeleteButton(cm.getNthReply({ cmtEl, index: 0 }), usr.user.id).click();
        const dialog = await alt.waitFor(p, {
          content: 'Do you want to delete this comment?',
          type: alt.AlertType.warning,
          buttons: alt.AlertButtons.YesNo,
          focusedBtn: 1,
        });
        await dialog.clickYes();

        await cm.shouldNotHaveReplies(cmtEl);
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
      {
        // Visitor.
        await p.reload(null);
        const cmtApp = await w.getCmtApp(p);
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
    }
  });
}

export default function testDelete(w: cm.CmtFixtureWrapper) {
  testDeleteCore(w, true);
  testDeleteCore(w, false);
}
