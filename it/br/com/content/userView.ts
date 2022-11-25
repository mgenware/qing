/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as tf from './timeField.js';

export interface ShouldAppearArgs {
  user: br.User;
  hasEdited?: boolean;
}

async function userIconShouldAppear(el: br.Element, u: br.User) {
  const img = el.$(`a[href="/u/${u.id}"] img[src="${u.iconURL}"][width="50"][height="50"]`);
  await img.e.toBeVisible();
  await img.e.toHaveAttribute('alt', u.name);
}

export async function shouldAppear(el: br.Element, arg: ShouldAppearArgs) {
  const u = arg.user;
  await userIconShouldAppear(el, u);
  // Name link.
  await el.$hasText(`a[href="/u/${u.id}"]`, u.name).e.toBeVisible();
  // Time field.
  await tf.shouldAppear(el.$('time-field'), !!arg.hasEdited);
}
