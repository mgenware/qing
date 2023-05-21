/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr } from 'br.js';
import { newPost } from 'helper/post.js';
import * as cm from './cm.js';
import * as pb from 'br/cm/content/pageBar.js';

const homeItemSel = 'main .section > div > .avatar-grid';
const page2URL = '/?page=2';

test('Home page - One page - Multiple users', async ({ page }) => {
  const p = $(page);

  await newPost(
    usr.user,
    async ({ link: link1 }) => {
      await newPost(
        usr.user2,
        async ({ link: link2 }) => {
          await p.goto('/', null);
          await pb.shouldNotExist(p.body);

          const items = p.$$(homeItemSel);
          await items.shouldHaveCount(2);

          await cm.checkHomeItem(items.item(0), {
            user: usr.user,
            title: `${cm.homePostBRPrefix}post1`,
            link: link1,
          });
          await cm.checkHomeItem(items.item(1), {
            user: usr.user2,
            title: `${cm.homePostBRPrefix}post2`,
            link: link2,
          });
        },
        { body: { title: `${cm.homePostBRPrefix}post2`, html: '_', summary: '_' } },
      );
    },
    { body: { title: `${cm.homePostBRPrefix}post1`, html: '_', summary: '_' } },
  );
});

test('Home page - 2 pages', async ({ page }) => {
  const p = $(page);

  await newPost(
    usr.user,
    async ({ link: link1 }) => {
      await newPost(
        usr.user2,
        async ({ link: link2 }) => {
          await newPost(
            usr.user2,
            async ({ link: link3 }) => {
              await p.goto('/', null);

              // Check first page.
              let items = p.$$(homeItemSel);
              await items.shouldHaveCount(2);

              await cm.checkHomeItem(items.item(0), {
                user: usr.user,
                title: `${cm.homePostBRPrefix}post1`,
                link: link1,
              });
              await cm.checkHomeItem(items.item(1), {
                user: usr.user2,
                title: `${cm.homePostBRPrefix}post2`,
                link: link2,
              });

              // Check page bar.
              await pb.check(p.body, { rightLink: page2URL });

              // Go to next page.
              await p.goto(page2URL, null);

              // Check next page.
              items = p.$$(homeItemSel);
              await items.shouldHaveCount(1);

              await cm.checkHomeItem(items.item(0), {
                user: usr.user2,
                title: `${cm.homePostBRPrefix}post3`,
                link: link3,
              });

              // Check page bar in next page.
              await pb.check(p.body, { leftLink: '/' });
            },
            { body: { title: `${cm.homePostBRPrefix}post3`, html: '_', summary: '_' } },
          );
        },
        { body: { title: `${cm.homePostBRPrefix}post2`, html: '_', summary: '_' } },
      );
    },
    { body: { title: `${cm.homePostBRPrefix}post1`, html: '_', summary: '_' } },
  );
});
