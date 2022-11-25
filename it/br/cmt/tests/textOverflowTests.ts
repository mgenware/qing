/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as def from 'base/def.js';
import * as cm from '../common.js';
import * as act from '../actions.js';

export default function testTextOverflow(w: cm.CmtFixtureWrapper) {
  w.test('Text overflow on cmt and reply', { viewer: br.usr.user }, async ({ p }) => {
    {
      await p.toMobile();
      const cmtApp = await w.getCmtApp(p);
      await act.writeCmt(p, { cmtApp, content: def.sd.longText });
      await p.shouldNotHaveHScrollBar();

      await act.writeReply(p, { content: def.sd.longText, cmtEl: cm.getTopCmt({ cmtApp }) });
      await p.shouldNotHaveHScrollBar();
    }
    {
      await p.reload();
      const cmtApp = await w.getCmtApp(p);
      await act.clickRepliesButton({ cmtEl: cm.getTopCmt({ cmtApp }), replyCount: 1 });
      await p.shouldNotHaveHScrollBar();
    }
  });
}
