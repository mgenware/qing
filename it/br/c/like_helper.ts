/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import puppeteer from 'puppeteer';
import { throwIfEmpty } from 'throw-if-arg-empty';
import * as ass from 'base/ass';

export async function checkLikes(
  likeAppEl: puppeteer.ElementHandle,
  value: number,
  liked: boolean,
) {
  throwIfEmpty(likeAppEl, 'likeAppEl');
  const btnEl = await likeAppEl.$('pierce/like-view > qing-button');
  ass.t(btnEl);

  // Element value.
  const numEl = await btnEl.$('span.num');
  ass.t(numEl);
  ass.e(await numEl.evaluate((el: HTMLElement) => el.textContent), `${value}`);

  // Liked status.
  const svgEl = await btnEl.$('svg-icon');
  ass.t(svgEl);
  ass.e(await svgEl.evaluate((el: HTMLElement) => el.className), liked ? 'liked' : 'not-liked');
}
