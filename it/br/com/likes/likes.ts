/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

export async function checkLikes(
  expect: brt.Expect,
  el: brt.Element,
  value: number,
  liked: boolean,
) {
  await expect(el).toBeVisible();
  const btnEl = el.$('like-view qing-button');

  // Element value.
  const numEl = btnEl.$('span.num');
  if (value) {
    await expect(numEl.evaluate((e) => e.textContent)).toBe(`${value}`);
  } else {
    await expect(numEl).toHaveCount(0);
  }

  // Liked status.
  const svgEl = btnEl.$('svg-icon');
  await expect(svgEl.evaluate((e) => e.className)).toBe(liked ? 'liked' : 'not-liked');
}
