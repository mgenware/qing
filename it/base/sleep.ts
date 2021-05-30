/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export default function sleep(ms?: number) {
  return new Promise((resolve) => setTimeout(resolve, ms ?? 300));
}
