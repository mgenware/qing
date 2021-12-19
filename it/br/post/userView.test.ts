/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test, usr } from 'br';
import { postCoreTraitsShouldAppear } from './common';

test('Post viewed by user', async ({ goto, page }) => {
  await newPost(usr.user, async (id) => {
    await postCoreTraitsShouldAppear(page, goto, id, usr.user, usr.user2);
  });
});
