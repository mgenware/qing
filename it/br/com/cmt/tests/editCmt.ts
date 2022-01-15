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
import { writeCmt, editCmt } from './actions';

function testEditCmtCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test('Edit a cmt - ' + (fresh ? 'Fresh' : 'Not fresh'), usr.user, async ({ page }) => {
    {
      {
        let cmtApp = await w.getCmtApp(page);
        await writeCmt(page, { cmtApp, content: defs.sd.content });

        if (!fresh) {
          await page.reload();
          cmtApp = await w.getCmtApp(page);
        }

        // Edit the comment.
        await editCmt(page, {
          cmtApp,
          author: usr.user,
          visuals: { contentHTML: defs.sd.contentHTML },
        });
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
