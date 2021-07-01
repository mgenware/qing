/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr, tmpBrowserPage } from 'base/br';
import { checkLikes } from 'br/helper/like';

test('Like a post', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`, usr.user);
    const { page } = br;

    const likeAppEl = await page.$('post-payload-app like-app');
    ass.t(likeAppEl);
    await checkLikes(likeAppEl, 0, false);

    await likeAppEl.click();
    await checkLikes(likeAppEl, 1, true);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await tmpBrowserPage(async (br) => {
      await br.goto(`/p/${id}`, usr.user2);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { page } = br;

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const likeAppEl = await page.$('post-payload-app like-app');
      ass.t(likeAppEl);
      await checkLikes(likeAppEl, 1, false);

      await likeAppEl.click();
      await checkLikes(likeAppEl, 2, true);

      await likeAppEl.click();
      await checkLikes(likeAppEl, 1, false);
    });

    await likeAppEl.click();
    await checkLikes(likeAppEl, 0, false);
  });
});
