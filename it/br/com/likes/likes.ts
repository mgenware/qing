/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

export async function likesShouldAppear(el: br.Element, value: number, liked: boolean) {
  const btnEl = await el.$('like-view qing-button').shouldBeVisible();

  // Element value.
  const numEl = btnEl.$('span.num');
  if (value) {
    await numEl.shouldHaveTextContent(`${value}`);
  } else {
    await numEl.shouldNotExist();
  }

  // Liked status.
  await btnEl.$('svg-icon').shouldHaveAttr('class', liked ? 'liked' : 'not-liked');
}
