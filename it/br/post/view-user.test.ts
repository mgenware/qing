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

test('View post - user', async ({ goto, page, expect }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user2);

    // User view.
    const u = usr.user;
    await checkUserView(expect, page.$(userViewQuery), u.id, u.iconURL, u.name);

    // Page content.
    const html = await page.content();
    expect(html).toContain(defs.sd.postTitleHTML);
    expect(html).toContain(defs.sd.postContentSan);
  });
});
