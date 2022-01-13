/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import * as defs from 'base/defs';
import * as cm from './common';
import { performWriteComment } from './performers';

function testCreateCmtCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test('Create a cmt' + (fresh ? ' (fresh)' : ''), usr.user, async ({ page }) => {
    {
      {
        // User 1.
        let cmtApp = await w.getCmtApp(page);
        await performWriteComment(page, { cmtApp, content: defs.sd.content }, true);

        if (!fresh) {
          await page.reload();
          cmtApp = await w.getCmtApp(page);
        }

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: defs.sd.content,
          highlighted: fresh,
          canEdit: true,
        });
        await cm.shouldHaveComments(cmtApp, 1);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: defs.sd.content,
        });
        await cm.shouldHaveComments(cmtApp, 1);
      }
    }
  });
}

export default function testCreateCmt(w: CmtFixtureWrapper) {
  testCreateCmtCore(w, true);
  testCreateCmtCore(w, false);
}
