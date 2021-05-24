/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';

export async function checkNoComments(cmtAppEl: testing.ElementHandle) {
  ass.t(await cmtAppEl.isVisible());
  const contentEl = await cmtAppEl.$('text=No comments');
  ass.t(contentEl);
  ass.t(await contentEl.isVisible());
}
