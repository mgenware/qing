/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { throwIfEmpty } from 'throw-if-arg-empty';
import { ass } from '../t.js';

export async function checkLikes(likeAppEl, value, selected) {
  throwIfEmpty(likeAppEl, 'likeAppEl');
  const numEl = await likeAppEl.$('pierce/like-view > qing-button > span.num');
  ass.t(numEl);
  ass.e(await numEl.evaluate((el) => el.textContent), `${value}`);
}
