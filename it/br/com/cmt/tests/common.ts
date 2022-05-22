/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { userViewShouldAppear } from 'br/com/content/userView';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { CmtFixture } from '../fixture';

export const cmtChildrenClass = '.br-children';
export const repliesBtnClass = '.br-replies-btn';

export async function commentsHeadingShouldAppear(el: br.Element) {
  return el.$hasText('h2', 'Comments').shouldBeVisible();
}

export function getNthCmt(cmtApp: br.Element, index: number) {
  return cmtApp.$(`cmt-block ${cmtChildrenClass} > cmt-block:nth-child(${index + 1})`);
}

export function getNthReply(cmtEl: br.Element, index: number) {
  return cmtEl.$(`${cmtChildrenClass} > cmt-block:nth-child(${index + 1})`);
}

export function getTopCmt(cmtApp: br.Element) {
  return getNthCmt(cmtApp, 0);
}

export interface CheckCmtArgs {
  author: br.User;
  content: string;
  canEdit?: boolean;
  highlighted?: boolean;
  hasEdited?: boolean;
}

export async function cmtShouldAppear(el: br.Element, e: CheckCmtArgs) {
  // User view.
  const row = el.$('.row');
  await userViewShouldAppear(row, { user: e.author, hasEdited: e.hasEdited });

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

export async function shouldHaveCmtCount(el: br.Element, count: number) {
  await el
    .$('.br-cmt-c')
    .shouldHaveTextContent(count === 1 ? '1 comment' : `${count || 'No'} comments`);
}

export async function shouldHaveShownRootCmtCount(el: br.Element, count: number) {
  await el.$$(`${cmtChildrenClass} > cmt-block`).shouldHaveCount(count);
}

export async function shouldHaveReplyCount(el: br.Element, count: number, shown: number) {
  const text = count === 1 ? '1 reply' : `${count || 'No'} replies`;
  await el.$(`${repliesBtnClass} link-button`).shouldHaveTextContent(shown ? `${text} ↑` : text);
  if (shown) {
    await el.$$(`${cmtChildrenClass} > cmt-block`).shouldHaveCount(shown);
  }
}

export function shouldNotHaveReplies(el: br.Element) {
  return el.$(cmtChildrenClass).shouldNotExist();
}

export class CmtFixtureWrapper {
  constructor(public groupName: string, public fixture: CmtFixture) {}

  test(name: string, initialViewer: br.User | null, cb: (arg: { page: br.Page }) => Promise<void>) {
    return br.test(`${this.groupName} - ${name}`, async ({ page }) => {
      const p = br.$(page);
      await this.fixture.start({ page: p, user: initialViewer }, () => cb({ page: p }));
    });
  }

  getCmtApp(page: br.Page) {
    return this.fixture.getCmtApp(page);
  }
}
