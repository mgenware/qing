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

  let link1 = '';
  let link2 = '';
  await newPost(
    usr.user,
    // eslint-disable-next-line @typescript-eslint/require-await
    async ({ link }) => {
      link1 = link;
    },
    { body: { title: `${cm.homePostBRPrefix}post1`, contentHTML: '_' } },
  );
  await newPost(
    usr.user2,
    // eslint-disable-next-line @typescript-eslint/require-await
    async ({ link }) => {
      link2 = link;
    },
    { body: { title: `${cm.homePostBRPrefix}post1`, contentHTML: '_' } },
  );

  await p.goto('/', null);
  const c = await p.c.content();
  expect(c.length).toBeTruthy();
});
