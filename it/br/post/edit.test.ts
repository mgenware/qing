/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr } from 'base/br';
import { checkUserView, getEditBarEditButton } from 'br/helper/userView';
import { checkEditorUpdate } from 'br/helper/editor';
import { userViewQuery } from './common';

test('Edit a post', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`, usr.user);
    const { page } = br;

    // User view.
    const u = usr.user;
    const userView = await page.$(userViewQuery);
    ass.t(userView);
    checkUserView(userView, u.eid, u.iconURL, u.name, true);

    const editBtn = await getEditBarEditButton(userView);
    ass.t(editBtn);
    await editBtn.click();
    await checkEditorUpdate(page, 'Save', 'Cancel');

    // "Edit post" heading is not part of the editor.
    const overlayEl = await page.$('set-post-app qing-overlay');
    ass.t(overlayEl);
    ass.t(await overlayEl.$('h2:has-text("Edit post")'));
  });
});
