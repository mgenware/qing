/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User, expect } from 'br';
import { likesShouldAppear } from 'br/com/likes/likes';
import { userViewShouldAppear } from 'br/com/content/userView';
import * as defs from 'base/defs';

export const userViewQuery = 'main > container-view > div.m-post-user > post-user-app';
export const cmtAppSelector = 'post-payload-app cmt-app';

export async function postShouldHaveContent(page: brt.Page, html: string) {
  const contentDiv = page.$('.m-post-user + hr + div');
  expect(await contentDiv.innerHTML()).toBe(html);
}

export async function postShouldHaveTitle(page: brt.Page, title: string, link: string) {
  const aEl = page.$('main > container-view > h2 > a');
  expect((await aEl.getAttribute('href'))?.endsWith(link)).toBeTruthy();
  expect(await aEl.textContent()).toBe(title);
}

export function postLink(id: string) {
  return `/p/${id}`;
}

export async function postCoreTraitsShouldAppear(
  page: brt.Page,
  id: string,
  author: User,
  user: User | null,
) {
  const link = postLink(id);
  await page.goto(link, user);

  // User view.
  await userViewShouldAppear(page.$(userViewQuery), { author });

  // Page content.
  await postShouldHaveTitle(page, defs.sd.postTitleRaw, link);
  await postShouldHaveContent(page, defs.sd.postContentSan);

  // Like button.
  const likeAppEl = page.$('post-payload-app like-app');
  await likesShouldAppear(likeAppEl, 0, false);

  return {
    likeAppEl,
  };
}
