/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { checkUserView } from 'br/com/content/userView';
import { userViewQuery } from './common';
import * as defs from 'base/defs';
import { checkEditBar } from 'br/com/editor/editBar';

test('View post - user', async ({ goto, page, expect }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user);

    // User view.
    const u = usr.user;
    const userView = page.$(userViewQuery);
    await checkUserView(expect, userView, u.id, u.iconURL, u.name);
    await checkEditBar(expect, userView, defs.entity.post, id, u.id);
  });
});
