/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { userViewShouldAppear } from 'br/com/content/userView';
import { userViewQuery } from './common';
import { editBarShouldAppear } from 'br/com/editor/editBar';

test('Post viewed by author', async ({ goto, page }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user);

    // User view.
    const u = usr.user;
    const userView = page.$(userViewQuery);
    await userViewShouldAppear(userView, u.id, u.iconURL, u.name);
    await editBarShouldAppear(userView, u.id);
  });
});
