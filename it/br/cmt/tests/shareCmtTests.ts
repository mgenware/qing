/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br';
import * as def from 'base/def';
import * as cm from '../common';
import * as act from '../actions';
import * as sh from 'br/com/overlays/share';

export default function testShare(w: cm.CmtFixtureWrapper) {
  w.test('Share a cmt or reply', usr.user, async ({ p }) => {
    {
      // Create 1 cmt and 1 reply.
      let cmtApp = await w.getCmtApp(p);
      await act.writeCmt(p, { cmtApp, content: def.sd.content });
      let cmtEl = cm.getTopCmt({ cmtApp });

      await act.writeReply(p, {
        cmtEl,
        content: def.sd.content,
      });

      await p.reload();

      cmtApp = await w.getCmtApp(p);
      cmtEl = cm.getTopCmt({ cmtApp });
      await cmtEl.$linkButton('Share').click();

      // Check cmt share URL.
      const cmtURL = new URL(p.c.url());
      cmtURL.searchParams.set('cmt', await cm.getCmtIDAsync({ cmtEl }));
      await sh.popupShouldAppear(p, cmtURL.toString());

      await act.clickRepliesButton({ cmtEl, replyCount: 1 });
      cmtEl = cm.getNthReply({ cmtEl, index: 0 });
      await cmtEl.$linkButton('Share').click();

      // Check reply share URL.
      const replyURL = new URL(p.c.url());
      replyURL.searchParams.set('cmt', await cm.getCmtIDAsync({ cmtEl }));
      await sh.popupShouldAppear(p, replyURL.toString());
    }
  });
}
