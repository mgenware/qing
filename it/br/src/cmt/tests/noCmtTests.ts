/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as cm from '../common.js';
import { CmtFixture } from '../fixture.js';
import { Page } from '@playwright/test';

export function testNoCmts(fixture: CmtFixture, page: Page) {
  return fixture.start(page, {}, async (arg) => {
    const { p } = arg;
    {
      // Visitor view.
      const cmtApp = await fixture.getCmtApp(p);
      await cm.commentsHeadingShouldAppear({ cmtApp });
      await cm.shouldHaveCmtCount({ cmtApp, count: 0 });

      // "Sign in" to comment.
      await cmtApp.$qingButton('Sign in').e.toBeVisible();
      await cmtApp.$hasText('span', 'to comment').e.toBeVisible();
    }
    {
      // User view.
      await p.reloadWithUser(usr.user);
      const cmtApp = await fixture.getCmtApp(p);
      await cm.commentsHeadingShouldAppear({ cmtApp });
      await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
    }
  });
}
