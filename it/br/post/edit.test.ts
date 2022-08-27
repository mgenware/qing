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

async function clickEditButton(p: br.Page) {
  const u = usr.user;
  const userView = p.$(cm.userViewQuery);
  const editBtn = eb.getEditButton(userView, u.id);
  await editBtn.click();
}

async function waitForOverlay(p: br.Page) {
  const { overlayEl } = await cps.waitForOverlay(p, 'set-entity-app');
  return overlayEl;
}

async function editorShouldAppear(p: br.Page) {
  const overlayEl = await waitForOverlay(p);
  await cps.shouldAppear(overlayEl, {
    name: 'Edit post',
    title: def.sd.title,
    contentHTML: def.sd.contentViewHTML,
  });
  return overlayEl;
}

test('Update post', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);
    await clickEditButton(p);

    // Check editor update.
    const overlayEl = await editorShouldAppear(p);
    await cps.updateAndSave(overlayEl, {
      p,
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
    const overlayEl = await waitForOverlay(p);
    await overlayEl.$qingButton('Cancel').click();
    await overlayEl.waitForDetached();

    // Verify page content.
    await cm.shouldHaveTitle(p, def.sd.title, link);
    await cm.shouldHaveContent(p, def.sd.content);
  });
});

function testDiscardChanges(mode: 'title' | 'content', discardChanges: boolean) {
  test(`${discardChanges ? 'Discard' : 'Keep'} post editor changes - Mode ${mode}`, async ({
    page,
  }) => {
    const p = $(page);
    await scPost(usr.user, async ({ link }) => {
      await p.goto(link, usr.user);

      await clickEditButton(p);

      const overlayEl = await waitForOverlay(p);
      await cps.updateContent(
        overlayEl,
        mode === 'title' ? { title: def.sd.updated } : { content: def.sd.updated },
      );

      await cps.shouldDiscardChangesOrNot(overlayEl, discardChanges, { p, cancelBtn: 'Cancel' });

      if (discardChanges) {
        // Verify page content.
        await cm.shouldHaveTitle(p, def.sd.title, link);
        await cm.shouldHaveContent(p, def.sd.content);
      } else {
        await cps.shouldAppear(
          overlayEl,
          mode === 'title' ? { title: def.sd.updated } : { contentHTML: def.sd.updated },
        );
      }
    });
  });
}

testDiscardChanges('title', true);
testDiscardChanges('content', true);
testDiscardChanges('title', false);
testDiscardChanges('content', false);
