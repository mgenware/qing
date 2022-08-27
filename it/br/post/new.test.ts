/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as br from 'br';
import * as cm from './common';
import * as def from 'base/def';
import * as cps from 'br/com/editing/composer';
import * as nbm from 'br/com/navbar/menu';

const editorDesc = 'New post';

async function clickNewPostButton(p: br.Page) {
  const userBtn = nbm.userMenuBtn(p);
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
      dbTimeChange: true,
      spinnerText: 'Publishing...',
      saveBtnText: 'Publish',
    }),
    p.c.waitForNavigation({ url: /\/p\// }),
  ]);

  // Verify post title.
  await cm.shouldHaveTitle(p, def.sd.content, p.url());
  // Verify post content.
  await cm.shouldHaveContent(p, def.sd.content);
});

test('New post - Dismiss post editor', async ({ page }) => {
  const p = $(page);
  await p.goto('/', usr.user);

  await clickNewPostButton(p);
  const overlayEl = await cm.waitForOverlay(p);
  await overlayEl.$qingButton('Cancel').click();
  await overlayEl.waitForDetached();
});

function testDiscardChanges(mode: 'title' | 'content', discardChanges: boolean) {
  test(`New post - ${
    discardChanges ? 'Discard' : 'Keep'
  } post editor changes - Mode ${mode}`, async ({ page }) => {
    const p = $(page);
    await scPost(usr.user, async ({ link }) => {
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
  });
}

testDiscardChanges('title', true);
testDiscardChanges('content', true);
testDiscardChanges('title', false);
testDiscardChanges('content', false);
