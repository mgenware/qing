/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { User, $, test } from 'br';
import * as brt from 'brt';
import { userViewShouldAppear } from 'br/com/content/userView';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { CmtFixture } from '../fixture';

export async function commentsHeadingShouldAppear(el: brt.Element) {
  return el.$('h2:has-text("Comments")').shouldBeVisible();
}

export function getNthCmt(cmtApp: brt.Element, index: number) {
  return cmtApp.$$('cmt-block').item(index);
}

export interface CheckCmtArgs {
  author: User;
  content: string;
  canEdit?: boolean;
  highlighted?: boolean;
  hasEdited?: boolean;
}

export async function cmtShouldAppear(el: brt.Element, e: CheckCmtArgs) {
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

export function shouldHaveComments(el: brt.Element, count: number) {
  return el
    .$('.br-cmt-c')
    .shouldHaveTextContent(count === 1 ? '1 comment' : `${count || 'No'} comments`);
}

export class CmtFixtureWrapper {
  constructor(public groupName: string, public fixture: CmtFixture) {}

  test(name: string, initialViewer: User | null, cb: (arg: { page: brt.Page }) => Promise<void>) {
    return test(`[${this.groupName}] ${name}`, async ({ page }) => {
      const p = $(page);
      await this.fixture.start({ page: p, user: initialViewer }, () => {
        return cb({ page: p });
      });
    });
  }

  getCmtApp(page: brt.Page) {
    return this.fixture.getCmtApp(page);
  }
}