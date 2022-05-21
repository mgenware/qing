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

const cmtChildrenClass = '.br-children';

export async function commentsHeadingShouldAppear(el: br.Element) {
  return el.$hasText('h2', 'Comments').shouldBeVisible();
}

export function getNthCmt(cmtApp: br.Element, index: number) {
  return cmtApp.$(`cmt-block ${cmtChildrenClass} > cmt-block:nth-child(${index + 1})`);
}

export function getNthReply(cmtApp: br.Element, index: number) {
  return cmtApp.$(`${cmtChildrenClass} > cmt-block:nth-child(${index + 1})`);
}

export function getTopCmt(cmtApp: br.Element) {
  return getNthCmt(cmtApp, 0);
}

export function getNthReplyFromTopCmt(cmtApp: br.Element, index: number) {
  return getNthReply(getNthCmt(cmtApp, 0), index);
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

export function shouldHaveCmtCount(el: br.Element, count: number) {
  return el
    .$('.br-cmt-c')
    .shouldHaveTextContent(count === 1 ? '1 comment' : `${count || 'No'} comments`);
}

export function shouldHaveReplyCount(el: br.Element, count: number) {
  return el
    .$('.btn-in-cmts')
    .shouldHaveTextContent(count === 1 ? '1 reply' : `${count || 'No'} replies`);
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
