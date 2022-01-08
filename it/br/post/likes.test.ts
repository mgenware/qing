/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import { likesShouldAppear } from 'br/com/likes/likes';

test('Like a post', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    const likeAppEl = p.$('post-payload-app like-app');
    await likesShouldAppear(likeAppEl, 0, false);

    await likeAppEl.click();
    await likesShouldAppear(likeAppEl, 1, true);

    {
      await p.goto(link, usr.user2);
      const likeAppEl2 = p.$('post-payload-app like-app');
      await likesShouldAppear(likeAppEl, 1, false);

      await likeAppEl2.click();
      await likesShouldAppear(likeAppEl, 2, true);

      await likeAppEl2.click();
      await likesShouldAppear(likeAppEl, 1, false);
    }

    await p.goto(link, usr.user);
    await likeAppEl.click();
    await likesShouldAppear(likeAppEl, 0, false);
  });
});
