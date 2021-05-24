/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr } from 'base/br';
import { checkLikes } from '../c/likeHelper.js';

test('View post', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`);

    // Page content.
    const html = await br.content();
    ass.t(html.includes('&lt;p&gt;post_t&lt;/p&gt;'));
    ass.t(html.includes('<p>post_c</p>'));

    // Like button.
    const likeAppEl = await br.page.$('post-payload-app like-app');
    ass.t(likeAppEl);
    await checkLikes(likeAppEl, 0, false);
  });
});
