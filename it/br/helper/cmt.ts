/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';

export async function checkNoComments(cmtAppEl: testing.ElementHandle) {
  // Root element is visible.
  ass.t(await cmtAppEl.isVisible());

  // "No comments" element.
  const contentEl = await cmtAppEl.$('text=No comments');
  ass.t(contentEl);
  ass.t(await contentEl.isVisible());

  // "Sign in" to comment.
  ass.t(await cmtAppEl.$('qing-button:has-text("Sign in")'));
  ass.t(await cmtAppEl.$('span:has-text("to comment")'));
}
