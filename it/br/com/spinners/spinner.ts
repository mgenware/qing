/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

export async function waitForGlobalSpinner(page: brt.Page) {
  await page.c.waitForSelector('__global_spinner_container spinner-view', { state: 'hidden' });
}
