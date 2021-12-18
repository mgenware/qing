/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { checkLikes } from 'br/com/likes/likes';

test('Like a post', async ({ goto, page, expect }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user);

    const likeAppEl = page.locator('post-payload-app like-app');
    await expect(likeAppEl).toBeVisible();
    await checkLikes(expect, likeAppEl, 0, false);

    await likeAppEl.click();
    await checkLikes(expect, likeAppEl, 1, true);

    {
      await goto(`/p/${id}`, usr.user2);
      const likeAppEl2 = page.locator('post-payload-app like-app');
      await expect(likeAppEl2).toBeVisible();
      await checkLikes(expect, likeAppEl, 1, false);

      await likeAppEl2.click();
      await checkLikes(expect, likeAppEl, 2, true);

      await likeAppEl2.click();
      await checkLikes(expect, likeAppEl, 1, false);
    }

    await likeAppEl.click();
    await checkLikes(expect, likeAppEl, 0, false);
  });
});
