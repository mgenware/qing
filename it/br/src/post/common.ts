/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as lk from 'cm/likes/likes.js';
import * as uv from 'cm/content/userView.js';
import * as eb from 'cm/editing/editBar.js';
import * as def from '@qing/dev/it/base/def.js';
import * as cps from 'cm/editing/composer.js';
import { expect } from '@playwright/test';

export const userViewQuery = 'main > div.container > div.m-post-user > post-user-app';

export async function shouldHaveHTML(page: br.BRPage, html: string) {
  await page.$('.m-post-user + hr + div').shouldHaveHTML(html);
}

export async function shouldHaveTitle(page: br.BRPage, title: string, link: string) {
  const aEl = page.$('main > div.container > h2 > a');
  await expect(aEl.c).toHaveAttribute('href', link);
  expect(await aEl.c.textContent()).toBe(title);
}

export async function shouldAppear(
  page: br.BRPage,
  link: string,
  author: br.User,
  user: br.User | null,
) {
  await page.goto(link, user);

  // User view.
  await uv.shouldAppear(page.$(userViewQuery), { user: author });

  // Page content.
  await shouldHaveTitle(page, def.sd.title, link);
  await shouldHaveHTML(page, def.sd.contentViewHTML);

  // Like button.
  const likesAppEl = page.$('post-payload-app likes-app');
  await lk.shouldAppear(likesAppEl, 0, false);

  return {
    likesAppEl,
  };
}

export async function waitForOverlay(p: br.BRPage) {
  const { overlayEl } = await cps.waitForOverlay(p, 'set-entity-app');
  return overlayEl;
}

export async function clickEditButton(p: br.BRPage, u: br.User) {
  const userView = p.$(userViewQuery);
  const editBtn = eb.getEditButton(userView, u.id);
  await editBtn.click();
}
