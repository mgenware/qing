/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from '@qing/dev/it/helper/post.js';
import { usr, $ } from 'br.js';
import { Page, test } from '@playwright/test';
import * as cm from './common.js';
import * as def from '@qing/dev/it/base/def.js';
import * as cps from 'cm/editing/composer.js';
import { iShouldNotCallThisDelay } from '@qing/dev/it/base/delay.js';

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
        date: def.oldDate,
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

async function testDiscardChanges(page: Page, mode: 'title' | 'content', discardChanges: boolean) {
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
}

test('Edit post - Keep editor changes - Title', async ({ page }) => {
  await testDiscardChanges(page, 'title', false);
});

test('Edit post - Discard editor changes - Title', async ({ page }) => {
  await testDiscardChanges(page, 'title', true);
});

test('Edit post - Keep editor changes - Content', async ({ page }) => {
  await testDiscardChanges(page, 'content', false);
});

test('Edit post - Discard editor changes - Content', async ({ page }) => {
  await testDiscardChanges(page, 'content', true);
});
