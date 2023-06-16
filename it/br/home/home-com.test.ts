/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr } from 'br.js';
import { batchNewPosts, newPost, postLinkFromID, deletePostsByPrefix } from 'helper/post.js';
import * as cm from './cm.js';
import * as pb from 'br/cm/content/pageBar.js';
import { appDef } from '@qing/def';

const homeItemSel = '.fi-item';
const page2URL = '/?page=2';

test('Home page - com - One page', async ({ page }) => {
  const p = $(page);
  const postPrefix = '__br_home_com_one_page';

  try {
    const ids = await batchNewPosts({
      user: usr.user,
      count: 2,
      title: '_TITLE_',
      content: '_HTML_',
      summary: '_SUMMARY_',
      prefix: postPrefix,
    });

    await p.goto('/', null, { params: { [appDef.brHomePrefixParam]: `${postPrefix}%` } });
    await pb.shouldNotExist(p.body);

    const items = p.$$(homeItemSel);
    await items.shouldHaveCount(2);

    await cm.checkHomeItem(items.item(0), {
      user: usr.user,
      title: `${cm.homePostBRPrefix}post1`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: postLinkFromID(ids[0]!),
    });
    await cm.checkHomeItem(items.item(1), {
      user: usr.user2,
      title: `${cm.homePostBRPrefix}post2`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: postLinkFromID(ids[0]!),
    });
  } finally {
    await deletePostsByPrefix(postPrefix);
  }
});

test('Home page - com - 2 pages', async ({ page }) => {
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
