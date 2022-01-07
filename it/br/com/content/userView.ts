/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User } from 'br';
import { timeFieldShouldAppear } from './timeField';

export interface CheckUserViewArgs {
  author: User;
}

export async function userViewShouldAppear(el: brt.Element, e: CheckUserViewArgs) {
  const { author } = e;
  // Profile image link.
  await el
    .$(`a[href="/u/${author.id}"] img[src="${author.iconURL}"][width="50"][height="50"]`)
    .shouldBeVisible();
  // Name link.
  await el.$(`a[href="/u/${author.id}"]:has-text("${author.name}")`).shouldBeVisible();
  // Time field.
  await timeFieldShouldAppear(el.$('time-field small'), false);
}
