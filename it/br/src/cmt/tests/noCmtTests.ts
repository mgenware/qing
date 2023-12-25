/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as cm from '../common.js';
import { CmtFixture } from '../fixture.js';
import { Page, expect } from '@playwright/test';

export function testNoCmts(fixture: CmtFixture, page: Page) {
  return fixture.start(page, {}, async (arg) => {
    const { p } = arg;
    {
      // Visitor view.
      const cmtApp = await fixture.getCmtApp(p);
      await cm.commentsHeadingShouldAppear({ cmtApp });
      await cm.shouldHaveCmtCount({ cmtApp, count: 0 });

      // "Sign in" to comment.
      await expect(cmtApp.$qingButton('Sign in').c).toBeVisible();
      await expect(cmtApp.$hasText('span', 'to comment').c).toBeVisible();
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
