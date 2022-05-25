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

// DB uses MySQL `DATETIME(3)`, wait 100ms so that time field gets updated.
export function waitForDBTimeChange() {
  return delay(100);
}
