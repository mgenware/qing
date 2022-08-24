/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as alt from 'br/com/overlays/alert';
import { postCoreTraitsShouldAppear } from './common';

test('Post page in visitor view', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    const { likesAppEl } = await postCoreTraitsShouldAppear(p, link, usr.user, null);

    // Click the like button.
    await likesAppEl.click();
    const btns = await alt.waitForAlert(p, {
      content: 'Sign in to like this post.',
      type: alt.AlertType.warning,
      buttons: alt.AlertButtons.OK,
    });
    const okBtn = btns.item(0);
    await alt.waitForDetachedAlert(p, () => okBtn.click());
  });
});
