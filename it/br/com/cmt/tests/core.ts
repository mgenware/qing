/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { performUpdateEditor } from 'br/com/editor/editor';
import * as defs from 'base/defs';
import * as cm from './common';
import { performWriteComment } from './performers';

export default function testCore(w: CmtFixtureWrapper) {
  w.test('Cmt core (no comments, write, view, edit)', usr.user, async ({ page }) => {
    {
      // User 1.
      let cmtApp = await w.getCmtApp(page);
      await cm.commentsHeadingShouldAppear(cmtApp);

      // Write a comment.
      await performWriteComment(page, { cmtApp, content: defs.sd.content }, true);
      await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
        author: usr.user,
        content: defs.sd.content,
        highlighted: true,
        canEdit: true,
      });
      await cm.shouldHaveComments(cmtApp, 1);

      // Refresh and view the comment.
      await page.reload();
      // Update `cmtApp` when page gets reloaded.
      cmtApp = await w.getCmtApp(page);
      await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
        author: usr.user,
        content: defs.sd.content,
        canEdit: true,
      });
      await cm.shouldHaveComments(cmtApp, 1);

      // Edit the comment.
      await getEditBarEditButton(cm.getNthCmt(cmtApp, 0), usr.user.id).click();
      await performUpdateEditor(page, { part: 'content' });
      await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
        author: usr.user,
        content: defs.sd.updated,
        canEdit: true,
        hasEdited: true,
      });
      await cm.shouldHaveComments(cmtApp, 1);
    }
    {
      // User 2.
      // Write another comment.
      await page.reload(usr.user2);
      const cmtApp = await w.getCmtApp(page);
      await performWriteComment(page, { cmtApp, content: defs.sd.content }, true);
      await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
        author: usr.user2,
        content: defs.sd.content,
        highlighted: true,
        canEdit: true,
      });
      await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 1), {
        author: usr.user,
        content: defs.sd.updated,
        hasEdited: true,
      });
      await cm.shouldHaveComments(cmtApp, 2);
    }
    {
      // Visitor.
      await page.reload(null);
      const cmtApp = await w.getCmtApp(page);
      await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
        author: usr.user2,
        content: defs.sd.content,
        highlighted: false,
        canEdit: false,
      });
      await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 1), {
        author: usr.user,
        content: defs.sd.updated,
        highlighted: false,
        canEdit: false,
      });
      await cm.shouldHaveComments(cmtApp, 2);
    }
  });
}
