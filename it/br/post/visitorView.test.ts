/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import {
  AlertButtons,
  AlertType,
  waitForAlertDetached,
  alertShouldAppear,
} from 'br/com/alerts/alert';
import { postCoreTraitsShouldAppear, cmtAppSelector } from './common';
import { testCmtAllVisitorMode } from 'br/com/cmt/cmt';

test('Post page (visitor)', async (page) => {
  await newPost(usr.user, async (id) => {
    const { likeAppEl } = await postCoreTraitsShouldAppear(page, id, usr.user, null);

    // Click the like button.
    await likeAppEl.click();
    const btns = await alertShouldAppear(
      page,
      '',
      'Sign in to like this post.',
      AlertType.warning,
      AlertButtons.OK,
      0,
    );
    const okBtn = btns.item(0);
    await okBtn.click();
    await waitForAlertDetached(page);
  });
});

testCmtAllVisitorMode('[post]', (p) => p.$(cmtAppSelector));
