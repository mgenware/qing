/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User, expect } from 'br';
import * as lk from 'br/com/likes/likes';
import * as uv from 'br/com/content/userView';
import * as def from 'base/def';
import * as cps from 'br/com/editing/composer';

export const userViewQuery = 'main > container-view > div.m-post-user > post-user-app';
export const cmtAppSelector = 'post-payload-app cmt-app';

export async function shouldHaveContent(page: br.Page, text: string) {
  await page.$('.m-post-user + hr + div').e.toHaveText(text);
}

export async function shouldHaveTitle(page: br.Page, title: string, link: string) {
  const aEl = page.$('main > container-view > h2 > a');
  await aEl.e.toHaveAttribute('href', link);
  expect(await aEl.c.textContent()).toBe(title);
}

export async function shouldAppear(page: br.Page, link: string, author: User, user: User | null) {
  await page.goto(link, user);

  // User view.
  await uv.shouldAppear(page.$(userViewQuery), { user: author });

  // Page content.
  await shouldHaveTitle(page, def.sd.title, link);
  await shouldHaveContent(page, def.sd.content);

  // Like button.
  const likesAppEl = page.$('post-payload-app likes-app');
  await lk.shouldAppear(likesAppEl, 0, false);

  return {
    likesAppEl,
  };
}

export async function waitForOverlay(p: br.Page) {
  const { overlayEl } = await cps.waitForOverlay(p, 'set-entity-app');
  return overlayEl;
}
