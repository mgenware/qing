/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import defs from 'base/defs';
import * as ass from 'base/ass';

export async function checkDefaultTimeFieldAsync(rootEl: testing.ElementHandle) {
  const el = await rootEl.$(
    `time-field[createdat="${defs.defaultTimeString}"][modifiedat="${defs.defaultTimeString}"]`,
  );
  ass.t(el);
  ass.t(await el.isVisible());
}
