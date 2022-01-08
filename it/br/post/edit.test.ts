/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as brt from 'brt';
import { userViewQuery, postShouldHaveTitle, postShouldHaveContent, postLink } from './common';
import { getEditButton } from 'br/com/editor/editBar';
import * as defs from 'base/defs';
import {
  editorShouldBeDismissed,
  editorShouldUpdate,
  EditorPart,
  editorShouldAppear,
} from 'br/com/editor/editor';

async function clickEditButton(page: brt.Page) {
  const u = usr.user;
  const userView = page.$(userViewQuery);
  const editBtn = getEditButton(userView, u.id);
  await editBtn.click();
}

async function postEditorShouldAppear(page: brt.Page) {
  await editorShouldAppear(page, {
    name: 'Edit post',
    title: defs.sd.title,
    contentHTML: defs.sd.contentHTML,
    buttons: [{ text: 'Save', style: 'success' }, { text: 'Cancel' }],
  });
}

function testEditorUpdate(part: EditorPart) {
  test(`Update post ${part === 'title' ? 'title' : 'content'}`, async ({ page }) => {
    const p = $(page);
    await newPost(usr.user, async (id) => {
      await p.goto(postLink(id), usr.user);
      await clickEditButton(p);

      // Check editor update.
      await postEditorShouldAppear(p);
      await editorShouldUpdate(p, part, defs.sd.updated);

      // Verify post title.
      await postShouldHaveTitle(
        p,
        part === 'title' ? defs.sd.updated : defs.sd.title,
        postLink(id),
      );
      // Verify post content.
      await postShouldHaveContent(p, part === 'title' ? defs.sd.content : defs.sd.updated);
    });
  });
}

test('Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async (id) => {
    await p.goto(postLink(id), usr.user);

    await clickEditButton(p);

    // Check editor dismissal.
    await editorShouldBeDismissed(p, 'Cancel');

    // Verify page content.
    await postShouldHaveTitle(p, defs.sd.title, postLink(id));
    await postShouldHaveContent(p, defs.sd.content);
  });
});

testEditorUpdate('title');
testEditorUpdate('content');
