/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test, usr, $ } from 'br';
import { postCoreTraitsShouldAppear } from './common';

test('Post page in user view', async ({ page }) => {
  await scPost(usr.user, async ({ link }) => {
    await postCoreTraitsShouldAppear($(page), link, usr.user, usr.user2);
  });
});
