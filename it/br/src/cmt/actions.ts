/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as cps from 'cm/editing/composer.js';
import * as eb from 'cm/editing/editBar.js';
import * as btn from 'cm/buttons/button.js';

const loadMoreCmtsText = 'More comments';
const loadMoreRepliesText = 'More replies';

export interface WriteCmtArgs {
  cmtApp: br.BRElement;
  content: string;
  date?: Date;
  shownCb?: (overlayEl: br.BRElement) => Promise<void>;
}

export async function writeCmt(p: br.BRPage, a: WriteCmtArgs) {
  const writeCmtBtn = await btn.shouldAppear(a.cmtApp.$qingButton('Write a comment'));
  await writeCmtBtn.click();
  const { overlayEl } = await cps.waitForOverlay(p, 'root-cmt-list');
  if (a.shownCb) {
    await a.shownCb(overlayEl);
  }
  await cps.updateAndSave(overlayEl, {
    p,
    saveBtnText: 'Send',
    content: a.content,
    date: a.date,
  });
}

export interface WriteReplyArgs {
  cmtEl: br.BRElement;
  content: string;
  date?: Date;
  shownCb?: (overlayEl: br.BRElement) => Promise<void>;
}

export async function writeReply(p: br.BRPage, a: WriteReplyArgs) {
  await a.cmtEl.$hasText('cmt-view link-button', 'Reply').click();
  const { overlayEl } = await cps.waitForOverlay(p, 'cmt-block');
  if (a.shownCb) {
    await a.shownCb(overlayEl);
  }
  await cps.updateAndSave(overlayEl, {
    p,
    content: a.content,
    saveBtnText: 'Send',
    date: a.date,
  });
}

export interface EditCmtArgs {
  cmtEl: br.BRElement;
  author: br.User;
  content?: string;
  date?: Date;
  shownCb?: (overlayEl: br.BRElement) => Promise<void>;
}

export async function editCmt(p: br.BRPage, a: EditCmtArgs) {
  await eb.getEditButton(a.cmtEl, a.author.id).click();
  const { overlayEl } = await cps.waitForOverlay(p, 'cmt-block');
  if (a.shownCb) {
    await a.shownCb(overlayEl);
  }

  await cps.updateAndSave(overlayEl, {
    p,
    content: a.content,
    saveBtnText: 'Save',
    date: a.date,
  });
}

export interface CmtAppArgs {
  cmtApp: br.BRElement;
}

export interface CmtElArgs {
  cmtEl: br.BRElement;
}

export function clickMoreCmts(a: CmtAppArgs) {
  return a.cmtApp.$linkButton(loadMoreCmtsText).click();
}

export function noMoreCmts(a: CmtAppArgs) {
  return a.cmtApp.$linkButton(loadMoreCmtsText).shouldNotExist();
}

export function clickMoreReplies(a: CmtElArgs) {
  return a.cmtEl.$linkButton(loadMoreRepliesText).click();
}

export interface ClickRepliesArgs extends CmtElArgs {
  replyCount: number;
  collapse?: boolean;
}

export function clickRepliesButton(a: ClickRepliesArgs) {
  const text =
    a.replyCount === 1 ? '1 reply' : `${a.replyCount || 'No'} replies` + (a.collapse ? ' ↑' : '');
  return a.cmtEl.$linkButton(text).click();
}
