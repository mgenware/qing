/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import * as brt from 'brt';
import { userViewQuery, checkPostTitle, checkPostHTML } from './common';
import { getEditButton } from 'br/com/editor/editBar';
import * as defs from 'base/defs';
import {
  editorShouldBeDismissed,
  editorShouldUpdate,
  EditorPart,
  editorShouldAppear,
} from 'br/com/editor/editor';

async function clickEdit(page: brt.Page) {
  const u = usr.user;
  const userView = page.$(userViewQuery);
  const editBtn = getEditButton(userView, u.id);
  await editBtn.click();
}

test('Post editor appears', async ({ page, goto }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user);

    await clickEdit(page);
    await editorShouldAppear(page, defs.sd.postTitleRaw, defs.sd.postContentSan, [
      { text: 'Save', style: 'success' },
      { text: 'Cancel' },
    ]);
  });
});

function testEditorUpdate(part: EditorPart) {
  test(`Post editor updates -> ${part === EditorPart.title ? 'title' : 'content'}`, async ({
    page,
    goto,
  }) => {
    await newPost(usr.user, async (id) => {
      await goto(`/p/${id}`, usr.user);

      await clickEdit(page);

      // Check editor update.
      await editorShouldUpdate(page, part);

      // Verify post title.
      await checkPostTitle(
        page,
        part === EditorPart.title ? defs.sd.updatedContentRaw : defs.sd.postTitleRaw,
        `/p/${id}`,
      );
      // Verify post content.
      await checkPostHTML(
        page,
        part === EditorPart.title ? defs.sd.postContentSan : defs.sd.updatedContentRawHTML,
      );
    });
  });
}

test('Post editor dismisses', async ({ page, goto }) => {
  await newPost(usr.user, async (id) => {
    await goto(`/p/${id}`, usr.user);

    await clickEdit(page);

    // Check editor dismissal.
    await editorShouldBeDismissed(page, 'Cancel');

    // Verify page content.
    await checkPostTitle(page, defs.sd.postTitleRaw, `/p/${id}`);
    await checkPostHTML(page, defs.sd.postContentSan);
  });
});

testEditorUpdate(EditorPart.title);
testEditorUpdate(EditorPart.content);
