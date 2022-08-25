/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as lk from 'br/com/likes/likes';

test('Like a post', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    const likesAppEl = p.$('post-payload-app likes-app');
    await lk.shouldAppear(likesAppEl, 0, false);

    await likesAppEl.click();
    await lk.shouldAppear(likesAppEl, 1, true);

    {
      await p.goto(link, usr.user2);
      const likesAppEl2 = p.$('post-payload-app likes-app');
      await lk.shouldAppear(likesAppEl, 1, false);

      await likesAppEl2.click();
      await lk.shouldAppear(likesAppEl, 2, true);

      await likesAppEl2.click();
      await lk.shouldAppear(likesAppEl, 1, false);
    }

    await p.goto(link, usr.user);
    await likesAppEl.click();
    await lk.shouldAppear(likesAppEl, 0, false);
  });
});
