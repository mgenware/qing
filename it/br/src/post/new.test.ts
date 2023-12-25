/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post.js';
import { test, usr, $ } from 'br.js';
import * as br from 'br.js';
import * as cm from './common.js';
import * as def from 'base/def.js';
import * as cps from 'cm/editing/composer.js';
import * as nbm from 'cm/navbar/menu.js';
import { Page } from '@playwright/test';

const editorDesc = 'New post';

async function clickNewPostButton(p: br.Page) {
  const userBtn = nbm.userDropdownBtn(p);
  await userBtn.click();
  await userBtn.$aButton('New post').click();
}

test('New post', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);
  await clickNewPostButton(p);

  const overlayEl = await cm.waitForOverlay(p);
  await cps.shouldAppear(overlayEl, {
    name: editorDesc,
    title: '',
    contentHTML: '',
  });
  await Promise.all([
    cps.updateAndSave(overlayEl, {
      p,
      title: def.sd.content,
      content: def.sd.content,
      date: def.oldDate,
      saveBtnText: 'Publish',
    }),
    p.c.waitForURL(/\/p\//),
  ]);

  // Verify post title.
  await cm.shouldHaveTitle(p, def.sd.content, p.url());
  // Verify post content.
  await cm.shouldHaveHTML(p, def.sd.contentViewHTML);
});

test('New post - Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);

  await clickNewPostButton(p);
  const overlayEl = await cm.waitForOverlay(p);
  await overlayEl.$qingButton('Cancel').click();
  await overlayEl.waitForDetached();
});

async function testDiscardChanges(page: Page, mode: 'title' | 'content', discardChanges: boolean) {
  const p = $(page);
  await newPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    await clickNewPostButton(p);

    const overlayEl = await cm.waitForOverlay(p);
    await cps.updateContent(
      overlayEl,
      mode === 'title' ? { title: def.sd.updated } : { content: def.sd.updated },
    );

    await cps.shouldDiscardChangesOrNot(overlayEl, discardChanges, { p, cancelBtn: 'Cancel' });

    if (!discardChanges) {
      await cps.shouldAppear(
        overlayEl,
        mode === 'title' ? { title: def.sd.updated } : { contentHTML: def.sd.updatedViewHTML },
      );
    }
  });
}

test('New post - Keep editor changes - Title', async ({ page }) => {
  await testDiscardChanges(page, 'title', false);
});

test('New post - Discard editor changes - Title', async ({ page }) => {
  await testDiscardChanges(page, 'title', true);
});

test('New post - Keep editor changes - Content', async ({ page }) => {
  await testDiscardChanges(page, 'content', false);
});

test('New post - Discard editor changes - Content', async ({ page }) => {
  await testDiscardChanges(page, 'content', true);
});
