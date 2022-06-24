/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import * as cm from './common';

export default function testNoCmts(w: CmtFixtureWrapper) {
  w.test('No comments', null, async ({ page }) => {
    {
      // Visitor view.
      const cmtApp = await w.getCmtApp(page);
      await cm.commentsHeadingShouldAppear({ cmtApp });
      await cm.shouldHaveCmtCount({ cmtApp, count: 0 });

      // "Sign in" to comment.
      await cmtApp.$qingButton('Sign in').shouldBeVisible();
      await cmtApp.$hasText('span', 'to comment').shouldBeVisible();
    }
    {
      // User view.
      await page.reload(usr.user);
      const cmtApp = await w.getCmtApp(page);
      await cm.commentsHeadingShouldAppear({ cmtApp });
      await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
    }
  });
}
