/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as br from 'br';
import { userViewQuery, postShouldHaveTitle, postShouldHaveContent } from './common';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import * as defs from 'base/defs';
import { editorShouldBeDismissed, EditorPart, editorShouldAppear } from 'br/com/editor/editor';
import { updateEditorTC } from 'br/com/editor/actions';

async function clickEditButton(page: br.Page) {
  const u = usr.user;
  const userView = page.$(userViewQuery);
  const editBtn = getEditBarEditButton(userView, u.id);
  await editBtn.click();
}

async function postEditorShouldAppear(page: br.Page) {
  await editorShouldAppear(page, {
    name: 'Edit post',
    title: defs.sd.title,
    contentHTML: defs.sd.contentHTML,
    buttons: [{ text: 'Save', style: 'success' }, { text: 'Cancel' }],
  });
}

function testPostUpdates(part: EditorPart) {
  test(`Update post ${part === 'title' ? 'title' : 'content'}`, async ({ page }) => {
    const p = $(page);
    await scPost(usr.user, async ({ link }) => {
      await p.goto(link, usr.user);
      await clickEditButton(p);

      // Check editor update.
      await postEditorShouldAppear(p);
      await updateEditorTC(p, { part, content: defs.sd.updated });

      // Verify post title.
      await postShouldHaveTitle(p, part === 'title' ? defs.sd.updated : defs.sd.title, link);
      // Verify post content.
      await postShouldHaveContent(p, part === 'title' ? defs.sd.content : defs.sd.updated);
    });
  });
}

test('Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    await clickEditButton(p);

    // Check editor dismissal.
    await editorShouldBeDismissed(p, 'Cancel');

    // Verify page content.
    await postShouldHaveTitle(p, defs.sd.title, link);
    await postShouldHaveContent(p, defs.sd.content);
  });
});

testPostUpdates('title');
testPostUpdates('content');
