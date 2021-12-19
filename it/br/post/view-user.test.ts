/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { userViewShouldAppear } from 'br/com/content/userView';
import { userViewQuery, postShouldHaveTitle, postShouldHaveContent } from './common';
import * as defs from 'base/defs';

test('Post viewed by user', async ({ goto, page }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user2);

    // User view.
    const u = usr.user;
    await userViewShouldAppear(page.$(userViewQuery), u.id, u.iconURL, u.name);

    // Page content.
    await postShouldHaveTitle(page, defs.sd.postTitleRaw, `/p/${id}`);
    await postShouldHaveContent(page, defs.sd.postContentSan);
  });
});
