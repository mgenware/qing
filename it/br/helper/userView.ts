/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';
import { checkDefaultTimeFieldAsync } from './timeField';

export async function checkUserViewAsync(
  el: testing.ElementHandle | null,
  id: string,
  iconURL: string,
  name: string,
) {
  ass.t(el);
  ass.t(await el.isVisible());

  // Profile image link.
  ass.t(await el.$(`a[href="/u/${id}"] img[src="${iconURL}"][width="50"][height="50"]`));
  // Name link.
  ass.t(await el.$(`a[href="/u/${id}"]:has-text("${name}")`));
  // Time field.
  await checkDefaultTimeFieldAsync(el);
}
