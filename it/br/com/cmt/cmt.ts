/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { $ } from 'br';
import * as pw from '@playwright/test';
import { buttonShouldAppear } from '../buttons/button';
import { editorShouldAppear } from '../editor/editor';

export type TestInputType = pw.TestType<
  pw.PlaywrightTestArgs &
    pw.PlaywrightTestOptions & {
      cmtApp: brt.Element;
    },
  pw.PlaywrightWorkerArgs & pw.PlaywrightWorkerOptions
>;

async function commentsHeadingShouldAppear(el: brt.Element) {
  return el.$('h2:has-text("Comments")').shouldBeVisible();
}

async function noCommentsShouldAppear(el: brt.Element) {
  await commentsHeadingShouldAppear(el);

  // "No comments" element.
  await el.$('text=No comments').shouldBeVisible();
}

export function testCmtOnVisitorMode(groupName: string, test: TestInputType) {
  test(`${groupName} No comments (visitor)`, async ({ cmtApp }) => {
    await noCommentsShouldAppear(cmtApp);

    // "Sign in" to comment.
    await cmtApp.$('qing-button:has-text("Sign in")').shouldBeVisible();
    await cmtApp.$('span:has-text("to comment")').shouldBeVisible();
  });
}

export function testCmtOnUserMode(groupName: string, test: TestInputType) {
  test(`${groupName} No comments (user)`, async ({ cmtApp }) => {
    await noCommentsShouldAppear(cmtApp);

    // "Write a comment" button.
    await buttonShouldAppear(cmtApp.$('qing-button'), {
      text: 'Write a comment',
      style: 'success',
    });
  });

  test(`${groupName} Write a comment`, async ({ page, cmtApp }) => {
    const p = $(page);
    await noCommentsShouldAppear(cmtApp);

    const writeCmtBtn = await buttonShouldAppear(cmtApp.$('qing-button'), {
      text: 'Write a comment',
      style: 'success',
    });
    await writeCmtBtn.click();
    await editorShouldAppear(p, {
      title: 'Write a comment',
      contentHTML: '',
      buttons: [{ text: 'Send', style: 'success' }, { text: 'Cancel' }],
    });
  });
}
