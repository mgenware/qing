/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr } from 'base/br';
import { checkUserViewAsync } from 'br/helper/userView';
import { userViewQuery } from './common';
import defs from 'base/defs';
import { checkEditBarAsync } from 'br/helper/editBar';

test('View post - user', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`, usr.user);
    const { page } = br;

    // User view.
    const u = usr.user;
    const userView = await page.$(userViewQuery);
    ass.t(userView);
    await checkUserViewAsync(userView, u.eid, u.iconURL, u.name);
    await checkEditBarAsync(userView, defs.entity.post, id, u.eid);
  });
});
