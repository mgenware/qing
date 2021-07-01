/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr } from 'base/br';
import { checkUserView } from 'br/helper/userView';
import { userViewQuery } from './common';
import defs from 'base/defs';

test('View post - user', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`, usr.user2);
    const { page } = br;

    // User view.
    const u = usr.user;
    await checkUserView(await page.$(userViewQuery), u.eid, u.iconURL, u.name);

    // Page content.
    const html = await br.content();
    ass.t(html.includes(defs.sd.postTitleEscaped));
    ass.t(html.includes(defs.sd.postContent));
  });
});
