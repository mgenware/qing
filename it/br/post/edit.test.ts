/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post.js';
import { test, usr, $ } from 'br.js';
import * as cm from './common.js';
import * as def from 'base/def.js';
import * as cps from 'br/cm/editing/composer.js';
import { iShouldNotCallThisDelay } from 'base/delay.js';

const editorDesc = 'Edit post';

test('Edit post', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);
    await cm.clickEditButton(p, usr.user);

    // Check editor update.
    const overlayEl = await cm.waitForOverlay(p);
    await cps.shouldAppear(overlayEl, {
      name: editorDesc,
      title: def.sd.title,
      contentHTML: def.sd.contentViewHTML,
    });
    await Promise.all([
      cps.updateAndSave(overlayEl, {
        p,
        title: def.sd.updated,
        content: def.sd.updated,
        dbTimeChange: true,
        saveBtnText: 'Save',
      }),
      p.waitForURL(/\/p\//),
    ]);

    // Fix post not updating in webkit.
    await iShouldNotCallThisDelay();
    // Verify post title.
    await cm.shouldHaveTitle(p, def.sd.updated, link);
    // Verify post content.
    await cm.shouldHaveHTML(p, def.sd.updatedViewHTML);
  });
});

test('Edit post - Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    await cm.clickEditButton(p, usr.user);
    const overlayEl = await cm.waitForOverlay(p);
    await overlayEl.$qingButton('Cancel').click();
    await overlayEl.waitForDetached();

    // Verify page content.
    await cm.shouldHaveTitle(p, def.sd.title, link);
    await cm.shouldHaveHTML(p, def.sd.contentViewHTML);
  });
});

function testDiscardChanges(mode: 'title' | 'content', discardChanges: boolean) {
  test(`Edit post - ${
    discardChanges ? 'Discard' : 'Keep'
  } post editor changes - Set ${mode}`, async ({ page }) => {
    const p = $(page);
    await newPost(usr.user, async ({ link }) => {
      await p.goto(link, usr.user);

      await cm.clickEditButton(p, usr.user);

      const overlayEl = await cm.waitForOverlay(p);
      await cps.updateContent(
        overlayEl,
        mode === 'title' ? { title: def.sd.updated } : { content: def.sd.updated },
      );

      await cps.shouldDiscardChangesOrNot(overlayEl, discardChanges, { p, cancelBtn: 'Cancel' });

      if (discardChanges) {
        // Verify page content.
        await cm.shouldHaveTitle(p, def.sd.title, link);
        await cm.shouldHaveHTML(p, def.sd.contentViewHTML);
      } else {
        await cps.shouldAppear(
          overlayEl,
          mode === 'title' ? { title: def.sd.updated } : { contentHTML: def.sd.updatedViewHTML },
        );
      }
    });
  });
}

testDiscardChanges('title', true);
testDiscardChanges('content', true);
testDiscardChanges('title', false);
testDiscardChanges('content', false);
