/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export default function delay(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Server uses MySQL `DATETIME` to track dates, we have to wait at least
// 1 sec to make an entity considered updated in DB.
export function waitForMinTimeChange() {
  return delay(1200);
}
