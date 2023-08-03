/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, usr } from 'br.js';
import { batchNewPosts, deletePostsByPrefix } from 'helper/post.js';
import * as cm from './cm.js';
import * as pb from 'br/cm/content/pageBar.js';
import { appDef } from '@qing/def';

const homeItemSel = '.fi-item';
const page2URL = '/?page=2';

test('Home page - com - One page', async ({ page }) => {
  const p = $(page);
  const prefix = '_br_home_com_one_page_';

  try {
    const posts = await batchNewPosts({
      user: usr.user,
      count: 2,
      title: 'TITLE',
      content: 'CONTENT',
      summary: 'SUMMARY',
      prefix,
      startingDate: new Date('2006-02-01'),
    });

    await p.goto('/', null, { params: { [appDef.brHomePrefixParam]: `${prefix}%` } });
    await pb.shouldNotExist(p.body);

    const items = p.$$(homeItemSel);
    await items.shouldHaveCount(2);

    await cm.checkHomeItem(items.item(0), {
      user: usr.user,
      title: `${prefix}TITLE_1`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[0]!.link,
    });
    await cm.checkHomeItem(items.item(1), {
      user: usr.user,
      title: `${prefix}TITLE_0`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[1]!.link,
    });
  } finally {
    await deletePostsByPrefix(prefix);
  }
});

test('Home page - com - 2 pages', async ({ page }) => {
  const p = $(page);
  const prefix = '_br_home_com_2_pages_';

  try {
    const posts = await batchNewPosts({
      user: usr.user,
      count: 3,
      title: 'TITLE',
      content: 'CONTENT',
      summary: 'SUMMARY',
      prefix,
      startingDate: new Date('2006-02-01'),
    });

    await p.goto('/', null, { params: { [appDef.brHomePrefixParam]: `${prefix}%` } });

    const items = p.$$(homeItemSel);
    await items.shouldHaveCount(2);

    await cm.checkHomeItem(items.item(0), {
      user: usr.user,
      title: `${prefix}TITLE_2`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[0]!.link,
    });
    await cm.checkHomeItem(items.item(1), {
      user: usr.user,
      title: `${prefix}TITLE_1`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[1]!.link,
    });

    // Check page bar.
    await pb.check(p.body, { rightLink: page2URL });
    // Go to next page.
    await pb.clickNextBtn(p.body);

    await cm.checkHomeItem(items.item(0), {
      user: usr.user,
      title: `${prefix}TITLE_0`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      link: posts[2]!.link,
    });

    // Check page bar.
    await pb.check(p.body, { leftLink: '/' });
  } finally {
    await deletePostsByPrefix(prefix);
  }
});

test('Home page - com - No content', async ({ page }) => {
  const p = $(page);
  const prefix = '__no_content__';

  await p.goto('/', null, { params: { [appDef.brHomePrefixParam]: `${prefix}%` } });

  // No page bar.
  await pb.shouldNotExist(p.body);

  // No feed items.
  const items = p.$$(homeItemSel);
  await items.shouldHaveCount(0);

  await p.$('no-content-view').shouldExist();
});
