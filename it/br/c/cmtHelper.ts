/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import playwright from 'playwright';
import * as ass from 'base/ass';

export async function checkNoComments(cmtAppEl: playwright.ElementHandle) {
  ass.t(await cmtAppEl.isVisible());
  const contentEl = await cmtAppEl.$('text=No comments');
  ass.t(contentEl);
  ass.t(await contentEl.isVisible());
}
