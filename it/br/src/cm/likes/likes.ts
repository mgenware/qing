/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
import * as br from 'br.js';

export async function shouldAppear(el: br.BRElement, value: number, liked: boolean) {
  const btnEl = el.$('likes-view qing-button');
  await expect(btnEl.c).toBeVisible();

  // Element value.
  const numEl = btnEl.$('span.num');
  if (value) {
    await expect(numEl.c).toHaveText(`${value}`);
  } else {
    await numEl.shouldNotExist();
  }

  // Liked status.
  await expect(btnEl.$('svg-icon').c).toHaveAttribute('class', liked ? 'liked' : 'not-liked');
}
