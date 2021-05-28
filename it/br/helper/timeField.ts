/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';

export async function checkDefaultTimeField(el: testing.ElementHandle | null) {
  ass.t(el);
  ass.t(await el.isVisible());
  ass.t(el.$('time-field[createdat="2021-04-29T15:48:21Z"][modifiedat="2021-04-29T15:48:21Z"]'));
}
