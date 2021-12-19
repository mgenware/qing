/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { likesShouldAppear } from 'br/com/likes/likes';

test('Post liked', async ({ goto, page }) => {
  await newPost(usr.user, async (id) => {
    const link = `/p/${id}`;
    await goto(link, usr.user);

    const likeAppEl = page.$('post-payload-app like-app');
    await likesShouldAppear(likeAppEl, 0, false);

    await likeAppEl.click();
    await likesShouldAppear(likeAppEl, 1, true);

    {
      await goto(`/p/${id}`, usr.user2);
      const likeAppEl2 = page.$('post-payload-app like-app');
      await likesShouldAppear(likeAppEl, 1, false);

      await likeAppEl2.click();
      await likesShouldAppear(likeAppEl, 2, true);

      await likeAppEl2.click();
      await likesShouldAppear(likeAppEl, 1, false);
    }

    await goto(link, usr.user);
    await likeAppEl.click();
    await likesShouldAppear(likeAppEl, 0, false);
  });
});
