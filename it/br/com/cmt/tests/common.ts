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

export async function commentsHeadingShouldAppear(e: { cmtApp: br.Element }) {
  return e.cmtApp.$hasText('h2', 'Comments').shouldBeVisible();
}

export function getNthCmt(e: { cmtApp: br.Element; index: number }) {
  return e.cmtApp.$(`cmt-block ${cmtChildrenClass} > cmt-block:nth-child(${e.index + 1})`);
}

export function getNthReply(e: { cmtEl: br.Element; index: number }) {
  return e.cmtEl.$(`${cmtChildrenClass} > cmt-block:nth-child(${e.index + 1})`);
}

export function getTopCmt(e: { cmtApp: br.Element }) {
  return getNthCmt({ cmtApp: e.cmtApp, index: 0 });
}

export interface CheckCmtArgs {
  cmtEl: br.Element;
  author: br.User;
  content: string;
  canEdit?: boolean;
  highlighted?: boolean;
  hasEdited?: boolean;
}

export async function cmtShouldAppear(e: CheckCmtArgs) {
  // User view.
  const row = e.cmtEl.$('.row');
  await userViewShouldAppear(row, { user: e.author, hasEdited: e.hasEdited });

  // Comment content.
  await row.$('div.col > div:nth-child(2)').shouldHaveTextContent(e.content);

  const editBtn = getEditBarEditButton(e.cmtEl, e.author.id);
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

export async function shouldHaveCmtCount(e: { cmtApp: br.Element; count: number }) {
  await e.cmtApp
    .$('.br-cmt-c')
    .shouldHaveTextContent(e.count === 1 ? '1 comment' : `${e.count || 'No'} comments`);
}

export async function shouldHaveShownRootCmtCount(el: br.Element, count: number) {
  await el.$$(`${cmtChildrenClass} > cmt-block`).shouldHaveCount(count);
}

export async function shouldHaveReplyCount(e: { cmtEl: br.Element; count: number; shown: number }) {
  const text = e.count === 1 ? '1 reply' : `${e.count || 'No'} replies`;
  await e.cmtEl
    .$(`${repliesBtnClass} link-button`)
    .shouldHaveTextContent(e.shown ? `${text} ↑` : text);
  if (e.shown) {
    await e.cmtEl.$$(`${cmtChildrenClass} > cmt-block`).shouldHaveCount(e.shown);
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
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      await this.fixture.start({ page: p, user: initialViewer }, () => cb({ page: p }));
    });
  }

  getCmtApp(page: br.Page) {
    return this.fixture.getCmtApp(page);
  }
}
