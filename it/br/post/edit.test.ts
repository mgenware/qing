/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as brt from 'brt';
import { userViewQuery, postShouldHaveTitle, postShouldHaveContent } from './common';
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

test('Post editor', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async (id) => {
    await p.goto(`/p/${id}`, usr.user);

    await clickEdit(p);
    await editorShouldAppear(p, {
      title: defs.sd.postTitleRaw,
      contentHTML: defs.sd.postContentSan,
      buttons: [{ text: 'Save', style: 'success' }, { text: 'Cancel' }],
    });
  });
});

function testEditorUpdate(part: EditorPart) {
  test(`Update post -> ${part === 'title' ? 'title' : 'content'}`, async ({ page }) => {
    const p = $(page);
    await newPost(usr.user, async (id) => {
      await p.goto(`/p/${id}`, usr.user);

      await clickEdit(p);

      // Check editor update.
      await editorShouldUpdate(p, part, defs.sd.updatedContentRaw);

      // Verify post title.
      await postShouldHaveTitle(
        p,
        part === 'title' ? defs.sd.updatedContentRaw : defs.sd.postTitleRaw,
        `/p/${id}`,
      );
      // Verify post content.
      await postShouldHaveContent(
        p,
        part === 'title' ? defs.sd.postContentSan : defs.sd.updatedContentRawHTMLWrapped,
      );
    });
  });
}

test('Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async (id) => {
    await p.goto(`/p/${id}`, usr.user);

    await clickEdit(p);

    // Check editor dismissal.
    await editorShouldBeDismissed(p, 'Cancel');

    // Verify page content.
    await postShouldHaveTitle(p, defs.sd.postTitleRaw, `/p/${id}`);
    await postShouldHaveContent(p, defs.sd.postContentSan);
  });
});

testEditorUpdate('title');
testEditorUpdate('content');
