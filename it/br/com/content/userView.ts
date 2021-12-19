/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { timeFieldShouldAppear } from './timeField';

export async function userViewShouldAppear(
  el: brt.Element,
  id: string,
  iconURL: string,
  name: string,
) {
  // Profile image link.
  await el.$(`a[href="/u/${id}"] img[src="${iconURL}"][width="50"][height="50"]`).shouldBeVisible();
  // Name link.
  await el.$(`a[href="/u/${id}"]:has-text("${name}")`).shouldBeVisible();
  // Time field.
  await timeFieldShouldAppear(el);
}
