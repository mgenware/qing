/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

export async function checkNoComments(expect: brt.Expect, el: brt.Element) {
  // Root element is visible.
  await expect(el).toBeVisible();

  // "No comments" element.
  const contentEl = el.$('text=No comments');
  await expect(contentEl).toHaveCount(1);

  // "Sign in" to comment.
  await expect(el.$('qing-button:has-text("Sign in")')).toHaveCount(1);
  await expect(el.$('span:has-text("to comment")')).toHaveCount(1);
}
