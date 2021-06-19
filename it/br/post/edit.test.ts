/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, ass, usr } from 'base/br';
import { userViewQuery } from './common';
import { checkEditBarAsync } from 'br/helper/editBar';
import defs from 'base/defs';
import { checkEditorDismissalAsync, checkEditorUpdateAsync, EditorPart } from 'br/helper/editor';

function testEditorUpdate(part: EditorPart) {
  test(`Updated ${part === EditorPart.title ? 'title' : 'content'}`, async (br) => {
    await newPost(usr.user, async (id) => {
      await br.goto(`/p/${id}`, usr.user);
      const { page } = br;

      // Show editor popup.
      const u = usr.user;
      const userView = await page.$(userViewQuery);
      ass.t(userView);
      const { editBtn } = await checkEditBarAsync(userView, defs.entity.post, id, u.eid);
      await editBtn.click();

      // Check editor title.
      const overlayEl = await page.$('set-post-app qing-overlay');
      ass.t(overlayEl);
      ass.t(await overlayEl.$('h2:has-text("Edit post")'));

      // Check editor update.
      await checkEditorUpdateAsync(page, part, 'Save', 'Cancel');

      // Verify page content.
      const html = await br.content();
      ass.t(
        html.includes(
          part === EditorPart.title ? defs.sd.updatedContentEscaped : defs.sd.postTitleEscaped,
        ),
      );
      ass.t(
        html.includes(
          part === EditorPart.title ? defs.sd.postContent : defs.sd.updatedContentEscaped,
        ),
      );
    });
  });
}

test('Cancelled', async (br) => {
  await newPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`, usr.user);
    const { page } = br;

    // User view.
    const u = usr.user;
    const userView = await page.$(userViewQuery);
    ass.t(userView);
    const { editBtn } = await checkEditBarAsync(userView, defs.entity.post, id, u.eid);
    ass.t(editBtn);

    // Make the editor show up.
    await editBtn.click();

    // Check editor title.
    const overlayEl = await page.$('set-post-app qing-overlay');
    ass.t(overlayEl);
    ass.t(await overlayEl.$('h2:has-text("Edit post")'));

    // Check editor dismissal.
    await checkEditorDismissalAsync(page, 'Cancel');

    // Verify page content.
    const html = await br.content();
    ass.t(html.includes(defs.sd.postTitleEscaped));
    ass.t(html.includes(defs.sd.postContent));
  });
});

testEditorUpdate(EditorPart.title);
testEditorUpdate(EditorPart.content);
