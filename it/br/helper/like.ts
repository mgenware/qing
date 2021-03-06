/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';

export async function checkLikes(likeAppEl: testing.ElementHandle, value: number, liked: boolean) {
  ass.t(await likeAppEl.isVisible());
  const btnEl = await likeAppEl.$('like-view qing-button');
  ass.t(btnEl);

  // Element value.
  const numEl = await btnEl.$('span.num');
  if (value) {
    ass.t(numEl);
    ass.e(await numEl.evaluate((el: HTMLElement) => el.textContent), `${value}`);
  } else {
    ass.f(numEl);
  }

  // Liked status.
  const svgEl = await btnEl.$('svg-icon');
  ass.t(svgEl);
  ass.e(await svgEl.evaluate((el: HTMLElement) => el.className), liked ? 'liked' : 'not-liked');
}
