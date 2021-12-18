/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import * as defs from 'base/defs';

export async function checkDefaultTimeField(expect: brt.Expect, el: brt.Element) {
  await expect(el).toBeVisible();
  await expect(
    el.$(`time-field[createdat="${defs.sd.timeString}"][modifiedat="${defs.sd.timeString}"]`),
  ).toBeVisible();
}
