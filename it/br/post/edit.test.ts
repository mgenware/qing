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
import { getEditBarEditButton } from 'br/com/editing/editBar';
import * as def from 'base/def';
import * as cp from 'br/com/editing/composer';
import { updateEditor } from 'br/com/editing/actions';

async function clickEditButton(page: br.Page) {
  const u = usr.user;
  const userView = page.$(userViewQuery);
  const editBtn = getEditBarEditButton(userView, u.id);
  await editBtn.click();
}

async function postEditorShouldAppear(page: br.Page) {
  await cp.composerShouldAppear(page, {
    name: 'Edit post',
    title: def.sd.title,
    contentHTML: def.sd.contentViewHTML,
    buttons: [{ text: 'Save', style: 'success' }, { text: 'Cancel' }],
  });
}

function testPostUpdates(part: cp.ComposerPart) {
  test(`Update post ${part === 'title' ? 'title' : 'content'}`, async ({ page }) => {
    const p = $(page);
    await scPost(usr.user, async ({ link }) => {
      await p.goto(link, usr.user);
      await clickEditButton(p);

      // Check editor update.
      await postEditorShouldAppear(p);
      await updateEditor(p, {
        part,
        content: def.sd.updated,
        dbTimeChange: true,
        spinnerText: 'Saving...',
      });

      // Verify post title.
      await postShouldHaveTitle(p, part === 'title' ? def.sd.updated : def.sd.title, link);
      // Verify post content.
      await postShouldHaveContent(p, part === 'title' ? def.sd.content : def.sd.updated);
    });
  });
}

test('Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    await clickEditButton(p);

    // Check editor dismissal.
    await cp.composerShouldBeDismissed(p, 'Cancel');

    // Verify page content.
    await postShouldHaveTitle(p, def.sd.title, link);
    await postShouldHaveContent(p, def.sd.content);
  });
});

testPostUpdates('title');
testPostUpdates('content');
