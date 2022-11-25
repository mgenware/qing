/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as cm from '../common.js';

export default function testNoCmts(w: cm.CmtFixtureWrapper) {
  w.test('No comments', {}, async ({ p }) => {
    {
      // Visitor view.
      const cmtApp = await w.getCmtApp(p);
      await cm.commentsHeadingShouldAppear({ cmtApp });
      await cm.shouldHaveCmtCount({ cmtApp, count: 0 });

      // "Sign in" to comment.
      await cmtApp.$qingButton('Sign in').e.toBeVisible();
      await cmtApp.$hasText('span', 'to comment').e.toBeVisible();
    }
    {
      // User view.
      await p.reload(usr.user);
      const cmtApp = await w.getCmtApp(p);
      await cm.commentsHeadingShouldAppear({ cmtApp });
      await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
    }
  });
}
