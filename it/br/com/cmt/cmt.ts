/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { $, User, usr } from 'br';
import * as pw from '@playwright/test';
import * as defs from 'base/defs';
import { performUpdateEditor } from 'br/com/editor/editor';
import { getEditBarEditButton } from '../editor/editBar';
import { userViewShouldAppear } from 'br/com/content/userView';
import { buttonShouldAppear } from '../buttons/button';
import { performWriteComment } from './util';

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

function getNthCmt(cmtApp: brt.Element, index: number) {
  return cmtApp.$$('cmt-block').item(index);
}

export interface CheckCmtArgs {
  author: User;
  content: string;
  canEdit: boolean;
  highlighted: boolean;
}

async function cmtShouldAppear(el: brt.Element, e: CheckCmtArgs) {
  // User view.
  const row = el.$('.row');
  await userViewShouldAppear(row, { author: e.author });

  // Comment content.
  await row.$('div.col > div:nth-child(2)').shouldHaveTextContent(e.content);

  const editBtn = getEditBarEditButton(el, e.author.id);
  if (e.canEdit) {
    await editBtn.shouldBeVisible();
  } else {
    await editBtn.shouldNotExist();
  }

  const highlightedCls = 'row highlighted';
  if (e.highlighted) {
    await row.shouldHaveClass(highlightedCls);
  } else {
    await row.shouldNotHaveClass(highlightedCls);
  }
}

export function cmtShouldHaveCount(el: brt.Element, count: number) {
  return el.$('.br-cmt-c').shouldHaveTextContent(count === 1 ? '1 comment' : `${count} comments`);
}

export function testCmtOnVisitorMode(groupName: string, test: TestInputType) {
  test(`${groupName} No comments (visitor)`, async ({ cmtApp }) => {
    await noCommentsShouldAppear(cmtApp);

    // "Sign in" to comment.
    await cmtApp.$qingButton('Sign in').shouldBeVisible();
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

  test(`${groupName} Core (no comments, write, view, edit)`, async ({ page, cmtApp }) => {
    const p = $(page);
    await noCommentsShouldAppear(cmtApp);

    // Case: write a comment.
    await performWriteComment(p, { cmtApp, content: defs.sd.content }, true);
    await cmtShouldAppear(getNthCmt(cmtApp, 0), {
      author: usr.user,
      content: defs.sd.content,
      highlighted: true,
      canEdit: true,
    });

    // Case: Refresh and view the comment.
    await page.reload();
    await cmtShouldAppear(getNthCmt(cmtApp, 0), {
      author: usr.user,
      content: defs.sd.content,
      highlighted: false,
      canEdit: true,
    });

    // Case: Edit the comment.
    await getEditBarEditButton(getNthCmt(cmtApp, 0), usr.user.id).click();
    await performUpdateEditor(p, { part: 'content' });
    await cmtShouldAppear(getNthCmt(cmtApp, 0), {
      author: usr.user,
      content: defs.sd.updated,
      highlighted: false,
      canEdit: true,
    });
  });
}
