/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as sh from 'br/com/overlays/share';
import { serverURL } from 'base/def';

test('Share a post', async ({ page }) => {
  const p = $(page);
  await newPost(usr.user, async ({ link }) => {
    await p.goto(link, null);

    const payloadApp = p.$('post-payload-app');
    await payloadApp.$linkButton('Share').click();
    await sh.popupShouldAppear(p, `${serverURL}${link}`);
  });
});
