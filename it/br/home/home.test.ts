/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, expect, $, usr } from 'br.js';
import { newPost } from 'helper/post.js';
import * as cm from './cm.js';

test('Home page - One page - Multiple users', async ({ page }) => {
  const p = $(page);

  await newPost(
    usr.user,
    async ({ link: link1 }) => {
      await newPost(
        usr.user,
        async ({ link: link2 }) => {
          await p.goto('/', null);
          const c = await p.c.content();
          expect(c.length).toBeTruthy();
        },
        { body: { title: `${cm.homePostBRPrefix}post2`, contentHTML: '_' } },
      );
    },
    { body: { title: `${cm.homePostBRPrefix}post1`, contentHTML: '_' } },
  );
});
