/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { likesShouldAppear } from 'br/com/likes/likes';
import { noCommentsShouldAppear } from 'br/com/cmt/cmt';
import {
  AlertButtons,
  AlertType,
  waitForAlertDetached,
  alertShouldAppear,
} from 'br/com/alerts/alert';
import { userViewShouldAppear } from 'br/com/content/userView';
import { userViewQuery, postShouldHaveTitle, postShouldHaveContent } from './common';
import * as defs from 'base/defs';

test('Post viewed by visitor', async ({ page, goto }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, null);

    // User view.
    const u = usr.user;
    await userViewShouldAppear(page.$(userViewQuery), u.id, u.iconURL, u.name);

    // Page content.
    await postShouldHaveTitle(page, defs.sd.postTitleRaw, `/p/${id}`);
    await postShouldHaveContent(page, defs.sd.postContentSan);

    // Like button.
    const likeAppEl = page.$('post-payload-app like-app');
    await likesShouldAppear(likeAppEl, 0, false);

    // No comments.
    const cmtAppEl = page.$('post-payload-app cmt-app');
    await noCommentsShouldAppear(cmtAppEl);

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
