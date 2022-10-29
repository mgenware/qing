/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import * as uv from 'br/com/content/userView';
import * as eb from 'br/com/editing/editBar';
import { CmtFixture, CmtFixtureStartCbArg, CmtFixtureStartOptions } from './fixture';

// Usage: `cmtEl.$(cmtChildrenSel)`.
export const cmtChildrenSel = '> div > .br-children';
export const repliesBtnSel = '.br-replies-btn';

export async function commentsHeadingShouldAppear(e: { cmtApp: br.Element }) {
  return e.cmtApp.$hasText('h2', 'Comments').e.toBeVisible();
}

export function getNthCmt(e: { cmtApp: br.Element; index: number }) {
  return e.cmtApp.$(`cmt-block ${cmtChildrenSel}.br-root > cmt-block:nth-child(${e.index + 1})`);
}

export function getNthReply(e: { cmtEl: br.Element; index: number }) {
  return e.cmtEl.$(`${cmtChildrenSel} > cmt-block:nth-child(${e.index + 1})`);
}

export function getTopCmt(e: { cmtApp: br.Element }) {
  return getNthCmt({ cmtApp: e.cmtApp, index: 0 });
}

export async function getCmtIDAsync(e: { cmtEl: br.Element }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id = await e.cmtEl.c.evaluate((el) => (el as any).cmt.id as string);
  if (!id) {
    throw new Error('Empty cmt_id');
  }
  return id;
}

export interface CheckCmtArgs {
  // <cmt-block>
  cmtEl: br.Element;
  author: br.User;
  content: string;
  canEdit?: boolean;
  highlighted?: boolean;
  hasEdited?: boolean;
}

export interface CheckCmtDeletedArgs {
  // <cmt-block>
  cmtEl: br.Element;
}

export async function shouldAppear(e: CheckCmtArgs) {
  // User view.
  const row = e.cmtEl.$('.avatar-grid');
  await uv.shouldAppear(row, { user: e.author, hasEdited: e.hasEdited });

  // Comment content.
  await row.$('.md-content').e.toHaveText(e.content);

  if (e.canEdit !== undefined) {
    const editBtn = eb.getEditButton(e.cmtEl, e.author.id);
    if (e.canEdit) {
      await editBtn.e.toBeVisible();
    } else {
      await editBtn.shouldNotExist();
    }
  }

  if (e.highlighted !== undefined) {
    const highlightedSel = '.root.highlighted';
    if (e.highlighted) {
      await e.cmtEl.$(highlightedSel).shouldExist();
    } else {
      await e.cmtEl.$(highlightedSel).shouldNotExist();
    }
  }
}

export async function shouldAppearDeleted(e: CheckCmtDeletedArgs) {
  return e.cmtEl.$('cmt-view div.p-md').e.toContainText('Comment deleted');
}

export async function shouldHaveCmtCount(e: { cmtApp: br.Element; count: number }) {
  await e.cmtApp
    .$('.br-cmt-c')
    .e.toHaveText(e.count === 1 ? '1 comment' : `${e.count || 'No'} comments`);
}

export async function shouldHaveShownRootCmtCount(el: br.Element, count: number) {
  await el.$$(`cmt-block ${cmtChildrenSel}.br-root > cmt-block`).shouldHaveCount(count);
}

export async function shouldHaveReplyCount(e: { cmtEl: br.Element; count: number; shown: number }) {
  const text = e.count === 1 ? '1 reply' : `${e.count || 'No'} replies`;
  await e.cmtEl.$(`${repliesBtnSel} link-button`).e.toHaveText(e.shown ? `${text} ↑` : text);
  if (e.shown) {
    await e.cmtEl.$$(`${cmtChildrenSel} > cmt-block`).shouldHaveCount(e.shown);
  }
}

export function shouldNotHaveReplies(el: br.Element) {
  return el.$(cmtChildrenSel).shouldNotExist();
}

export class CmtFixtureWrapper {
  constructor(public groupName: string, public fixture: CmtFixture) {}

  test(
    name: string,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureStartCbArg) => Promise<void>,
  ) {
    return br.test(`${this.groupName} - ${name}`, async ({ page }) => {
      const p = br.$(page);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      await this.fixture.start(p, opt, cb);
    });
  }

  getCmtApp(page: br.Page) {
    return this.fixture.getCmtApp(page);
  }

  getHostURL(page: br.Page) {
    return this.fixture.getHostURL(page);
  }
}