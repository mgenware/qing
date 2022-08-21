/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

export async function waitForGlobalSpinner(
  page: br.Page,
  text: string,
  trigger: () => Promise<unknown>,
) {
  const sel = `#__global_spinner_container spinner-view:has-text(${JSON.stringify(text)})`;
  await Promise.all([trigger(), page.c.waitForSelector(sel, { state: 'attached' })]);
  await page.c.waitForSelector(sel, { state: 'detached' });
}
