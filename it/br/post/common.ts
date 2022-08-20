/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User, expect } from 'br';
import { likesShouldAppear } from 'br/com/likes/likes';
import { userViewShouldAppear } from 'br/com/content/userView';
import * as def from 'base/def';

export const userViewQuery = 'main > container-view > div.m-post-user > post-user-app';
export const cmtAppSelector = 'post-payload-app cmt-app';

export async function postShouldHaveContent(page: br.Page, text: string) {
  await page.$('.m-post-user + hr + div').e.toHaveText(text);
}

export async function postShouldHaveTitle(page: br.Page, title: string, link: string) {
  const aEl = page.$('main > container-view > h2 > a');
  expect((await aEl.getAttribute('href'))?.endsWith(link)).toBeTruthy();
  expect(await aEl.c.textContent()).toBe(title);
}

export async function postCoreTraitsShouldAppear(
  page: br.Page,
  link: string,
  author: User,
  user: User | null,
) {
  await page.goto(link, user);

  // User view.
  await userViewShouldAppear(page.$(userViewQuery), { user: author });

  // Page content.
  await postShouldHaveTitle(page, def.sd.title, link);
  await postShouldHaveContent(page, def.sd.content);

  // Like button.
  const likesAppEl = page.$('post-payload-app likes-app');
  await likesShouldAppear(likesAppEl, 0, false);

  return {
    likesAppEl,
  };
}
