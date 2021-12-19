/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { checkUserView } from 'br/com/content/userView';
import { userViewQuery, checkPostTitle, checkPostHTML } from './common';
import * as defs from 'base/defs';

test('View post - user', async ({ goto, page }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user2);

    // User view.
    const u = usr.user;
    await checkUserView(page.$(userViewQuery), u.id, u.iconURL, u.name);

    // Page content.
    await checkPostTitle(page, defs.sd.postTitleRaw, `/p/${id}`);
    await checkPostHTML(page, defs.sd.postContentSan);
  });
});
