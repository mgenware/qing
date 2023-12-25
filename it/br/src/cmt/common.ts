/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
import * as br from 'br.js';
import * as uv from 'cm/content/userView.js';
import * as eb from 'cm/editing/editBar.js';

// Usage: `cmtEl.$(cmtChildrenSel)`.
export const cmtChildrenSel = '> div > .br-children';
export const repliesBtnSel = '.br-replies-btn';

export async function commentsHeadingShouldAppear(e: { cmtApp: br.BRElement }) {
  return expect(e.cmtApp.$hasText('h2', 'Comments').c).toBeVisible();
}

export function getNthCmt(e: { cmtApp: br.BRElement; index: number }) {
  return e.cmtApp.$(`cmt-block ${cmtChildrenSel}.br-root > cmt-block:nth-child(${e.index + 1})`);
}

export function getNthReply(e: { cmtEl: br.BRElement; index: number }) {
  return e.cmtEl.$(`${cmtChildrenSel} > cmt-block:nth-child(${e.index + 1})`);
}

export function getTopCmt(e: { cmtApp: br.BRElement }) {
  return getNthCmt({ cmtApp: e.cmtApp, index: 0 });
}

export async function getCmtIDAsync(e: { cmtEl: br.BRElement }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id = await e.cmtEl.c.evaluate((el) => (el as any).cmt.id as string);
  if (!id) {
    throw new Error('Empty cmt_id');
  }
  return id;
}

export interface CheckCmtArgs {
  // <cmt-block>
  cmtEl: br.BRElement;
  author: br.User;
  content: string;
  canEdit?: boolean;
  highlighted?: boolean;
  hasEdited?: boolean;
  // If true, wait for the lit update to finish.
  waitForLitUpdate?: boolean;
}

export interface CheckCmtDeletedArgs {
  // <cmt-block>
  cmtEl: br.BRElement;
}

export async function shouldAppear(a: CheckCmtArgs) {
  if (a.waitForLitUpdate) {
    await a.cmtEl.waitForLitUpdate();
  }

  // User view.
  const row = a.cmtEl.$('.avatar-grid');
  await uv.shouldAppear(row, { user: a.author, hasEdited: a.hasEdited });

  // Comment content.
  await expect(row.$('.md-content').c).toHaveText(a.content);

  if (a.canEdit !== undefined) {
    const editBtn = eb.getEditButton(a.cmtEl, a.author.id);
    if (a.canEdit) {
      await expect(editBtn.c).toBeVisible();
    } else {
      await editBtn.shouldNotExist();
    }
  }

  if (a.highlighted !== undefined) {
    const highlightedSel = '.root.highlighted';
    if (a.highlighted) {
      await a.cmtEl.$(highlightedSel).shouldExist();
    } else {
      await a.cmtEl.$(highlightedSel).shouldNotExist();
    }
  }
}

export async function shouldAppearDeleted(e: CheckCmtDeletedArgs) {
  return expect(e.cmtEl.$('cmt-view div.p-md').c).toContainText('Comment deleted');
}

export async function shouldHaveCmtCount(e: { cmtApp: br.BRElement; count: number }) {
  await expect(e.cmtApp.$('.br-cmt-c').c).toHaveText(
    e.count === 1 ? '1 comment' : `${e.count || 'No'} comments`,
  );
}

export async function shouldHaveShownRootCmtCount(el: br.BRElement, count: number) {
  await el.$$(`cmt-block ${cmtChildrenSel}.br-root > cmt-block`).shouldHaveCount(count);
}

export async function shouldHaveReplyCount(e: {
  cmtEl: br.BRElement;
  count: number;
  shown: number;
}) {
  const text = e.count === 1 ? '1 reply' : `${e.count || 'No'} replies`;
  await expect(e.cmtEl.$(`${repliesBtnSel} link-button`).c).toHaveText(
    e.shown ? `${text} ↑` : text,
  );
  if (e.shown) {
    await e.cmtEl.$$(`${cmtChildrenSel} > cmt-block`).shouldHaveCount(e.shown);
  }
}

export function shouldNotHaveReplies(el: br.BRElement) {
  return el.$(cmtChildrenSel).shouldNotExist();
}
