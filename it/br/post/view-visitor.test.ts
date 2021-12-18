/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { checkLikes } from 'br/com/likes/likes';
import { checkNoComments } from 'br/com/cmt/cmt';
import {
  AlertButtons,
  AlertType,
  checkNoVisibleAlert,
  checkVisibleAlert,
} from 'br/com/alerts/alert';
import { checkUserView } from 'br/com/content/userView';
import { userViewQuery } from './common';
import * as defs from 'base/defs';
import sleep from 'base/sleep';

test('View post - visitor', async ({ page, expect, goto }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, null);

    // User view.
    const u = usr.user;
    await checkUserView(expect, page.locator(userViewQuery), u.id, u.iconURL, u.name);

    // Page content.
    const html = await page.content();
    expect(html).toContain(defs.sd.postTitleHTML);
    expect(html).toContain(defs.sd.postContentSan);

    // Like button.
    const likeAppEl = page.locator('post-payload-app like-app').first();
    await checkLikes(expect, likeAppEl, 0, false);

    // No comments.
    const cmtAppEl = page.locator('post-payload-app cmt-app');
    await checkNoComments(expect, cmtAppEl);

    // Click the like button.
    await likeAppEl.click();
    const btns = await checkVisibleAlert(
      expect,
      page,
      '',
      'Sign in to like this post.',
      AlertType.warning,
      AlertButtons.OK,
      0,
    );
    const okBtn = btns.nth(0);
    await okBtn?.click();
    await sleep();
    await checkNoVisibleAlert(expect, page);
  });
});
