/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { buttonShouldAppear } from '../buttons/button';

async function commentsHeadingShouldAppear(el: brt.Element) {
  return el.$('h2:has-text("Comments")').shouldBeVisible();
}

export async function noCommentsShouldAppear(el: brt.Element, user: boolean) {
  await commentsHeadingShouldAppear(el);

  // "No comments" element.
  await el.$('text=No comments').shouldBeVisible();

  if (user) {
    await buttonShouldAppear(el.$('qing-button'), { text: 'Write a comment', style: 'success' });
  } else {
    // "Sign in" to comment.
    await el.$('qing-button:has-text("Sign in")').shouldBeVisible();
    await el.$('span:has-text("to comment")').shouldBeVisible();
  }
}
