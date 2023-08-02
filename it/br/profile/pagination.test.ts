/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr } from 'br.js';
import { batchNewPosts } from 'helper/post.js';
import * as cm from './cm.js';
import * as pb from 'br/cm/content/pageBar.js';
import { appDef } from '@qing/def';
import { newUser } from 'helper/user.js';

const feedItemSel = '.profile-feed';
const postPrefix = 'profile-pagination-';

test('Profile pagination - 1 page', async ({ page }) => {
  const p = $(page);

  await newUser(async (u) => {
    const posts = await batchNewPosts({
      user: u,
      count: 2,
      title: 'TITLE',
      content: 'CONTENT',
      summary: 'SUMMARY',
      prefix: postPrefix,
      startingDate: new Date('2006-02-01'),
    });

    const url = `/u/${u.id}`;
    await p.goto(url);
    await pb.shouldNotExist(p.body);

    const items = p.$$(feedItemSel);
    await items.shouldHaveCount(2);

    await cm.checkProfileFeed(items.item(0), {
      user: usr.user,
      title: `${postPrefix}TITLE_1`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[0]!.link,
    });
    await cm.checkProfileFeed(items.item(1), {
      user: usr.user,
      title: `${postPrefix}TITLE_0`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[1]!.link,
    });
  });
});

test('Profile pagination - 2 pages', async ({ page }) => {
  const p = $(page);

  await newUser(async (u) => {
    const posts = await batchNewPosts({
      user: u,
      count: 3,
      title: 'TITLE',
      content: 'CONTENT',
      summary: 'SUMMARY',
      prefix: postPrefix,
      startingDate: new Date('2006-02-01'),
    });

    const url = `/u/${u.id}`;
    await p.goto(url);

    const items = p.$$(feedItemSel);
    await items.shouldHaveCount(2);

    await cm.checkProfileFeed(items.item(0), {
      user: usr.user,
      title: `${postPrefix}TITLE_2`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[0]!.link,
    });
    await cm.checkProfileFeed(items.item(1), {
      user: usr.user,
      title: `${postPrefix}TITLE_1`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[1]!.link,
    });

    // Check page bar.
    await pb.check(p.body, { rightLink: `${url}?page=2` });
    // Go to next page.
    await pb.clickNextBtn(p.body);

    await cm.checkProfileFeed(items.item(0), {
      user: usr.user,
      title: `${postPrefix}TITLE_0`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[2]!.link,
    });

    // Check page bar.
    await pb.check(p.body, { leftLink: url });
  });
});

test('Profile pagination - No content', async ({ page }) => {
  const p = $(page);

  await newUser(async (u) => {
    await p.goto(`/u/${u.id}`);

    // No page bar.
    await pb.shouldNotExist(p.body);

    // No feed items.
    const items = p.$$(feedItemSel);
    await items.shouldHaveCount(0);

    await p.$('no-content-view').shouldExist();
  });
});
