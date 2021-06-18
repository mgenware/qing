/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr } from 'base/br';
import { checkLikesAsync } from 'br/helper/like';
import { checkNoCommentsAsync } from 'br/helper/cmt';
import { AlertType, checkVisibleAlertAsync } from 'br/helper/alert';
import { checkUserViewAsync } from 'br/helper/userView';
import { userViewQuery } from './common';

test('View post - visitor', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`, null);
    const { page } = br;

    // User view.
    const u = usr.user;
    await checkUserViewAsync(await page.$(userViewQuery), u.eid, u.iconURL, u.name);

    // Page content.
    const html = await br.content();
    ass.t(html.includes('&lt;p&gt;post_t&lt;/p&gt;'));
    ass.t(html.includes('<p>post_c</p>'));

    // Like button.
    const likeAppEl = await page.$('post-payload-app like-app');
    ass.t(likeAppEl);
    await checkLikesAsync(likeAppEl, 0, false);

    // No comments.
    const cmtAppEl = await page.$('post-payload-app cmt-app');
    ass.t(cmtAppEl);
    await checkNoCommentsAsync(cmtAppEl);

    // Click the like button.
    await likeAppEl.click();
    await checkVisibleAlertAsync(br, '', 'Sign in to like this post', AlertType.warning, ['OK'], 0);
  });
});
