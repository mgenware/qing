/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as alt from 'br/com/overlays/alert';
import * as cm from './common';

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
