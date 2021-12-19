/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

export const userViewQuery = 'main > container-view > div.m-post-user > post-user-app';

export async function postShouldHaveContent(page: brt.Page, html: string) {
  const contentDiv = page.$('.m-post-user + hr + div');
  page.expect(await contentDiv.innerHTML()).toBe(html);
}

export async function postShouldHaveTitle(page: brt.Page, title: string, link: string) {
  const aEl = page.$('main > container-view > h2 > a');
  const { expect } = page;
  expect((await aEl.getAttribute('href'))?.endsWith(link)).toBeTruthy();
  expect(await aEl.textContent()).toBe(title);
}
