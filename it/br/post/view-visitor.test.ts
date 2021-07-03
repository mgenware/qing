/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr } from 'base/br';
import { checkLikes } from 'br/helper/like';
import { checkNoComments } from 'br/helper/cmt';
import { AlertButtons, AlertType, checkNoVisibleAlert, checkVisibleAlert } from 'br/helper/alert';
import { checkUserView } from 'br/helper/userView';
import { userViewQuery } from './common';
import defs from 'base/defs';
import sleep from 'base/sleep';

test('View post - visitor', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`, null);
    const { page } = br;

    // User view.
    const u = usr.user;
    await checkUserView(await page.$(userViewQuery), u.eid, u.iconURL, u.name);

    // Page content.
    const html = await br.content();
    ass.t(html.includes(defs.sd.postTitleEscaped));
    ass.t(html.includes(defs.sd.postContent));

    // Like button.
    const likeAppEl = await page.$('post-payload-app like-app');
    ass.t(likeAppEl);
    await checkLikes(likeAppEl, 0, false);

    // No comments.
    const cmtAppEl = await page.$('post-payload-app cmt-app');
    ass.t(cmtAppEl);
    await checkNoComments(cmtAppEl);

    // Click the like button.
    await likeAppEl.click();
    const [okBtn] = await checkVisibleAlert(
      page,
      '',
      'Sign in to like this post.',
      AlertType.warning,
      AlertButtons.OK,
      0,
    );
    await okBtn?.click();
    await sleep();
    await checkNoVisibleAlert(page);
  });
});
