/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { test } from 'br';
import { buttonShouldAppear } from '../buttons/button';

async function commentsHeadingShouldAppear(el: brt.Element) {
  return el.$('h2:has-text("Comments")').shouldBeVisible();
}

async function noCommentsShouldAppear(el: brt.Element) {
  await commentsHeadingShouldAppear(el);

  // "No comments" element.
  await el.$('text=No comments').shouldBeVisible();
}

export function testCmtMainVisitor(cmtApp: brt.Element, groupName: string) {
  test(`${groupName} No comments (visitor)`, async () => {
    await noCommentsShouldAppear(cmtApp);

    // "Sign in" to comment.
    await cmtApp.$('qing-button:has-text("Sign in")').shouldBeVisible();
    await cmtApp.$('span:has-text("to comment")').shouldBeVisible();
  });
}

export function testCmtMainUser(cmtApp: brt.Element, groupName: string) {
  test(`${groupName} No comments (user)`, async () => {
    await noCommentsShouldAppear(cmtApp);

    // "Write a comment" button.
    await buttonShouldAppear(cmtApp.$('qing-button'), {
      text: 'Write a comment',
      style: 'success',
    });
  });

  test(`${groupName} Write a comment`, async () => {
    await noCommentsShouldAppear(cmtApp);

    const writeCmtBtn = await buttonShouldAppear(cmtApp.$('qing-button'), {
      text: 'Write a comment',
      style: 'success',
    });
    await writeCmtBtn.click();
  });
}
