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
  waitForAlertDetached,
  checkVisibleAlert,
} from 'br/com/alerts/alert';
import { checkUserView } from 'br/com/content/userView';
import { userViewQuery, checkPostTitle, checkPostHTML } from './common';
import * as defs from 'base/defs';

test('View post - visitor', async ({ page, goto }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, null);

    // User view.
    const u = usr.user;
    await checkUserView(page.$(userViewQuery), u.id, u.iconURL, u.name);

    // Page content.
    await checkPostTitle(page, defs.sd.postTitleRaw, `/p/${id}`);
    await checkPostHTML(page, defs.sd.postContentSan);

    // Like button.
    const likeAppEl = page.$('post-payload-app like-app');
    await checkLikes(likeAppEl, 0, false);

    // No comments.
    const cmtAppEl = page.$('post-payload-app cmt-app');
    await checkNoComments(cmtAppEl);

    // Click the like button.
    await likeAppEl.click();
    const btns = await checkVisibleAlert(
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
