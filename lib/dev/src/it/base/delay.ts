/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export function iShouldNotCallThisDelay(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
