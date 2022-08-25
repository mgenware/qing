/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as br from 'br';
import * as cm from './common';
import * as eb from 'br/com/editing/editBar';
import * as def from 'base/def';
import * as cps from 'br/com/editing/composer';

async function clickEditButton(page: br.Page) {
  const u = usr.user;
  const userView = page.$(cm.userViewQuery);
  const editBtn = eb.getEditButton(userView, u.id);
  await editBtn.click();
}

async function editorShouldAppear(page: br.Page) {
  await cps.shouldAppear(page, {
    name: 'Edit post',
    title: def.sd.title,
    contentHTML: def.sd.contentViewHTML,
    buttons: [{ text: 'Save', style: 'success' }, { text: 'Cancel' }],
  });
}

test('Update post', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);
    await clickEditButton(p);

    // Check editor update.
    await editorShouldAppear(p);
    await cps.updateAndSave(p, {
      title: def.sd.updated,
      content: def.sd.updated,
      dbTimeChange: true,
      spinnerText: 'Saving...',
      saveBtnText: 'Save',
    });

    // Verify post title.
    await cm.shouldHaveTitle(p, def.sd.updated, link);
    // Verify post content.
    await cm.shouldHaveContent(p, def.sd.updated);
  });
});

test('Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    await clickEditButton(p);

    // Check editor dismissal.
    await cps.shouldBeDismissed(p, 'Cancel');

    // Verify page content.
    await cm.shouldHaveTitle(p, def.sd.title, link);
    await cm.shouldHaveContent(p, def.sd.content);
  });
});

function testDiscardChanges(mode: 'title' | 'content') {
  test(`Discard post editor changes - Mode ${mode}`, async ({ page }) => {
    const p = $(page);
    await scPost(usr.user, async ({ link }) => {
      await p.goto(link, usr.user);

      await clickEditButton(p);

      const { composerEl } = await cps.waitForVisibleComposer(p);
      await cps.updateContent(
        composerEl,
        mode === 'title' ? { title: def.sd.updated } : { content: def.sd.updated },
      );

      await cps.shouldDiscardChangesOrNot(composerEl, true, { p, cancelBtn: 'Cancel' });

      // Verify page content.
      await cm.shouldHaveTitle(p, def.sd.title, link);
      await cm.shouldHaveContent(p, def.sd.content);
    });
  });
}

testDiscardChanges('title');
testDiscardChanges('content');
