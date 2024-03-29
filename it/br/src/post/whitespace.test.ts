/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr, $ } from 'br.js';
import { test, expect } from '@playwright/test';
import { newPost } from '@qing/dev/it/helper/post.js';
import * as cps from 'cm/editing/composer.js';
import * as cm from './common.js';

const longText = `A${'\n'.repeat(30)}B`;

test('Editor vertical scroll and whitespaces', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async ({ link }) => {
    await p.goto(link, usr.user);

    await cm.clickEditButton(p, usr.user);
    const overlayEl = await cm.waitForOverlay(p);

    await cps.updateContent(overlayEl, {
      content: longText,
    });

    // Check editor content has vertical scrollbar.
    const contentEl = overlayEl.$('.kx-content');
    const hasVerticalScrollbar = await contentEl.c.evaluate(
      (el) => el.scrollHeight > el.clientHeight,
    );
    expect(hasVerticalScrollbar).toBe(true);

    await cps.clickSaveButton(overlayEl, { p, saveBtnText: 'Save' });
    await p.reload();

    // Verify post content.
    await cm.shouldHaveHTML(
      p,
      '<p>A</p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p>B</p>',
    );
  });
});
