/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User } from 'br';
import * as cps from 'br/com/editing/composer';
import * as eb from 'br/com/editing/editBar';
import * as btn from 'br/com/buttons/button';

const loadMoreCmtsText = 'More comments';
const loadMoreRepliesText = 'More replies';

export interface WriteCmtArgs {
  cmtApp: br.Element;
  content: string;
  dbTimeChange?: boolean;
  shownCb?: (overlayEl: br.Element) => Promise<void>;
}

export async function writeCmt(p: br.Page, a: WriteCmtArgs) {
  const writeCmtBtn = await btn.shouldAppear(a.cmtApp.$qingButton('Write a comment'));
  await writeCmtBtn.click();
  const { overlayEl } = await cps.waitForOverlay(p, 'root-cmt-list');
  if (a.shownCb) {
    await a.shownCb(overlayEl);
  }
  await cps.updateAndSave(overlayEl, {
    p,
    spinnerText: 'Publishing...',
    saveBtnText: 'Send',
    content: a.content,
    dbTimeChange: a.dbTimeChange,
  });
}

export interface WriteReplyArgs {
  cmtEl: br.Element;
  content: string;
  dbTimeChange?: boolean;
  shownCb?: (overlayEl: br.Element) => Promise<void>;
}

export async function writeReply(p: br.Page, a: WriteReplyArgs) {
  await a.cmtEl.$hasText('cmt-view link-button', 'Reply').click();
  const { overlayEl } = await cps.waitForOverlay(p, 'cmt-block');
  if (a.shownCb) {
    await a.shownCb(overlayEl);
  }
  await cps.updateAndSave(overlayEl, {
    p,
    content: a.content,
    saveBtnText: 'Send',
    spinnerText: 'Publishing...',
    dbTimeChange: a.dbTimeChange,
  });
}

export interface EditCmtArgs {
  cmtEl: br.Element;
  author: User;
  content?: string;
  shownCb?: (overlayEl: br.Element) => Promise<void>;
}

export async function editCmt(p: br.Page, a: EditCmtArgs) {
  await eb.getEditButton(a.cmtEl, a.author.id).click();
  const { overlayEl } = await cps.waitForOverlay(p, 'cmt-block');
  if (a.shownCb) {
    await a.shownCb(overlayEl);
  }

  await cps.updateAndSave(overlayEl, {
    p,
    content: a.content,
    saveBtnText: 'Save',
    dbTimeChange: true,
    spinnerText: 'Saving...',
  });
}

export interface CmtAppArgs {
  cmtApp: br.Element;
}

export interface CmtElArgs {
  cmtEl: br.Element;
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
