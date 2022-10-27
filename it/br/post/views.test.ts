/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as cm from './common';
import * as alt from 'br/com/overlays/alert';
import * as def from 'base/def';

test('Post page in author view', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async ({ link }) => {
    await cm.shouldAppear(p, link, usr.user, usr.user);
  });
});

test('Post page in user view', async ({ page }) => {
  await newPost(usr.user, async ({ link }) => {
    await cm.shouldAppear($(page), link, usr.user, usr.user2);
  });
});

test('Post page in visitor view', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async ({ link }) => {
    const { likesAppEl } = await cm.shouldAppear(p, link, usr.user, null);

    // Click the like button.
    await likesAppEl.click();
    const dialog = await alt.waitFor(p, {
      content: 'Sign in to like this post.',
      type: alt.AlertType.warning,
      buttons: alt.AlertButtons.OK,
    });
    await dialog.clickOK();
  });
});

test('Post page text overflow', async ({ page }) => {
  await newPost(
    usr.user,
    async ({ link }) => {
      const p = $(page);
      await p.goto(link, null, { mobile: true });
      await p.shouldNotHaveHScrollBar();
    },
    { body: { title: def.sd.longText, contentHTML: def.sd.longText } },
  );
});
