/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import {
  AlertButtons,
  AlertType,
  waitForAlertDetached,
  alertShouldAppear,
} from 'br/com/alerts/alert';
import { postCoreTraitsShouldAppear } from './common';

test('Post page (visitor)', async ({ page }) => {
  const p = $(page);
  await scPost(usr.user, async ({ link }) => {
    const { likeAppEl } = await postCoreTraitsShouldAppear(p, link, usr.user, null);

    // Click the like button.
    await likeAppEl.click();
    const btns = await alertShouldAppear(
      p,
      '',
      'Sign in to like this post.',
      AlertType.warning,
      AlertButtons.OK,
      0,
    );
    const okBtn = btns.item(0);
    await okBtn.click();
    await waitForAlertDetached(p);
  });
});
