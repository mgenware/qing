/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr, $ } from 'br';
import * as cm from './common';

test('Post page in user view', async ({ page }) => {
  await newPost(usr.user, async ({ link }) => {
    await cm.shouldAppear($(page), link, usr.user, usr.user2);
  });
});
