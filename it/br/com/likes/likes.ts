/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

export async function shouldAppear(el: br.Element, value: number, liked: boolean) {
  const btnEl = el.$('likes-view qing-button');
  await btnEl.e.toBeVisible();

  // Element value.
  const numEl = btnEl.$('span.num');
  if (value) {
    await numEl.e.toHaveText(`${value}`);
  } else {
    await numEl.shouldNotExist();
  }

  // Liked status.
  await btnEl.$('svg-icon').e.toHaveAttribute('class', liked ? 'liked' : 'not-liked');
}
