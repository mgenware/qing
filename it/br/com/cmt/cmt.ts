/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

export async function noCommentsShouldAppear(el: brt.Element) {
  // "No comments" element.
  const contentEl = el.$('text=No comments');
  await contentEl.shouldBeVisible();

  // "Sign in" to comment.
  await el.$('qing-button:has-text("Sign in")').shouldBeVisible();
  await el.$('span:has-text("to comment")').shouldBeVisible();
}
