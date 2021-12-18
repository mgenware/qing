/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { userViewQuery } from './common';
import { checkEditBar } from 'br/com/editor/editBar';
import * as defs from 'base/defs';
import { checkEditorDismissal, checkEditorUpdate, EditorPart } from 'br/com/editor/editor';

function testEditorUpdate(part: EditorPart) {
  test(`Updated ${part === EditorPart.title ? 'title' : 'content'}`, async ({
    page,
    goto,
    expect,
  }) => {
    await newPost(usr.user, async (id) => {
      await goto(`/p/${id}`, usr.user);

      // Show editor popup.
      const u = usr.user;
      const userView = page.$(userViewQuery);
      await expect(userView).toBeVisible();
      const { editBtn } = await checkEditBar(expect, userView, defs.entity.post, id, u.id);
      await editBtn.click();

      // Check editor title.
      const overlayEl = page.$('set-entity-app qing-overlay');
      await expect(overlayEl).toBeVisible();
      await expect(overlayEl.$('h2:has-text("Edit post")')).toBeVisible();

      // Check editor update.
      await checkEditorUpdate(expect, page, part, 'Save', 'Cancel');

      const html = await page.content();
      // Verify post title.
      expect(html).toContain(
        part === EditorPart.title ? defs.sd.updatedContentHTMLFull : defs.sd.postTitleHTML,
      );
      // Verify post content.
      expect(html).toContain(
        part === EditorPart.title ? defs.sd.postContentSan : defs.sd.updatedContentHTML,
      );
    });
  });
}

test('Cancelled', async ({ page, expect, goto }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user);

    // User view.
    const u = usr.user;
    const userView = page.$(userViewQuery);
    await expect(userView).toBeVisible();
    const { editBtn } = await checkEditBar(expect, userView, defs.entity.post, id, u.id);

    // Make the editor show up.
    await editBtn.click();

    // Check editor title.
    const overlayEl = page.$('set-entity-app qing-overlay');
    await expect(overlayEl).toBeVisible();
    await expect(overlayEl.$('h2:has-text("Edit post")')).toBeVisible();

    // Check editor dismissal.
    await checkEditorDismissal(expect, page, 'Cancel');

    // Verify page content.
    const html = await page.content();
    expect(html).toContain(defs.sd.postTitleHTML);
    expect(html).toContain(defs.sd.postContentSan);
  });
});

testEditorUpdate(EditorPart.title);
testEditorUpdate(EditorPart.content);
