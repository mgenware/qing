/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User } from 'br';
import { waitForOverlayVisible } from 'br/com/editor/editor';
import { updateEditor } from 'br/com/editor/actions';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { buttonShouldAppear } from 'br/com/buttons/button';
import * as cm from './common';

const loadMoreCmtsText = 'More comments';
const loadMoreRepliesText = 'More replies';

export interface WriteCmtArgs {
  cmtApp: br.Element;
  content: string;
  dbTimeChange?: boolean;
  shownCb?: () => Promise<void>;
}

export async function writeCmt(p: br.Page, a: WriteCmtArgs) {
  const writeCmtBtn = await buttonShouldAppear(a.cmtApp.$('qing-button'), {
    text: 'Write a comment',
    style: 'success',
  });
  await writeCmtBtn.click();

  await waitForOverlayVisible(p);
  if (a.shownCb) {
    await a.shownCb();
  }
  await updateEditor(p, {
    part: 'content',
    content: a.content,
    dbTimeChange: a.dbTimeChange,
  });
}

export interface WriteReplyArgs {
  cmtEl: br.Element;
  content: string;
  dbTimeChange?: boolean;
  shownCb?: () => Promise<void>;
}

export async function writeReply(p: br.Page, a: WriteReplyArgs) {
  await a.cmtEl.$hasText('cmt-view link-button', 'Reply').click();

  await waitForOverlayVisible(p);
  if (a.shownCb) {
    await a.shownCb();
  }
  await updateEditor(p, {
    part: 'content',
    content: a.content,
    dbTimeChange: a.dbTimeChange,
  });
}

export interface EditCmtArgs {
  cmtApp: br.Element;
  author: User;
  content?: string;
  shownCb?: () => Promise<void>;
}

export async function editCmt(p: br.Page, a: EditCmtArgs) {
  await getEditBarEditButton(a.cmtApp, a.author.id).click();

  await waitForOverlayVisible(p);
  if (a.shownCb) {
    await a.shownCb();
  }

  await updateEditor(p, { part: 'content', content: a.content, dbTimeChange: true });
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
}

export function clickReplies(a: ClickRepliesArgs) {
  return a.cmtEl.$linkButton(`${a.replyCount} ${a.replyCount > 1 ? 'Replies' : 'Reply'}`).click();
}

export function clickRepliesButton(a: CmtElArgs) {
  return a.cmtEl.$(`${cm.repliesBtnClass} link-button`).click();
}
