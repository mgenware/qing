/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

export async function checkLikes(
  expect: brt.Expect,
  el: brt.Locator,
  value: number,
  liked: boolean,
) {
  await expect(el).toBeVisible();
  const btnEl = el.locator('like-view qing-button').first();

  // Element value.
  const numEl = btnEl.locator('span.num');
  if (value) {
    await expect(numEl.first().evaluate((e) => e.textContent)).toBe(`${value}`);
  } else {
    await expect(numEl).toHaveCount(0);
  }

  // Liked status.
  const svgEl = btnEl.locator('svg-icon').first();
  await expect(svgEl.evaluate((e) => brt.asHTMLElement(e).className)).toBe(
    liked ? 'liked' : 'not-liked',
  );
}
