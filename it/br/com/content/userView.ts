/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { checkDefaultTimeField } from './timeField';

export async function checkUserView(
  expect: brt.Expect,
  el: brt.Element,
  id: string,
  iconURL: string,
  name: string,
) {
  await expect(el).toBeVisible();

  // Profile image link.
  await expect(
    el.$(`a[href="/u/${id}"] img[src="${iconURL}"][width="50"][height="50"]`),
  ).toBeVisible();
  // Name link.
  await expect(el.$(`a[href="/u/${id}"]:has-text("${name}")`)).toBeVisible();
  // Time field.
  await checkDefaultTimeField(expect, el);
}
