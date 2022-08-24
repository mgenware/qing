/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User } from 'br';
import { waitForVisibleComposer } from 'br/com/editing/composer';
import { updateEditor } from 'br/com/editing/actions';
import { getEditBarEditButton } from 'br/com/editing/editBar';
import { buttonShouldAppear } from 'br/com/buttons/button';

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
  await waitForVisibleComposer(p, () => writeCmtBtn.click());
  if (a.shownCb) {
    await a.shownCb();
  }
  await updateEditor(p, {
    part: 'content',
    spinnerText: 'Publishing...',
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
  await waitForVisibleComposer(p, () => a.cmtEl.$hasText('cmt-view link-button', 'Reply').click());
  if (a.shownCb) {
    await a.shownCb();
  }
  await updateEditor(p, {
    part: 'content',
    content: a.content,
    spinnerText: 'Publishing...',
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
  await waitForVisibleComposer(p, () => getEditBarEditButton(a.cmtApp, a.author.id).click());
  if (a.shownCb) {
    await a.shownCb();
  }

  await updateEditor(p, {
    part: 'content',
    content: a.content,
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
}

export function clickRepliesButton(a: ClickRepliesArgs) {
  const text = a.replyCount === 1 ? '1 reply' : `${a.replyCount || 'No'} replies`;
  return a.cmtEl.$linkButton(text).click();
}
