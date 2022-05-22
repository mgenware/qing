/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User } from 'br';
import { waitForOverlayVisible } from 'br/com/editor/editor';
import { updateEditorNTC, updateEditorTC } from 'br/com/editor/actions';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { buttonShouldAppear } from 'br/com/buttons/button';
import * as cm from './common';

const loadMoreCmtsText = 'More comments';
const loadMoreRepliesText = 'More replies';

export interface WriteCmtArgs {
  cmtApp: br.Element;
  content: string;
  waitForTimeChange?: boolean;
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
  await updateEditorNTC(p, {
    part: 'content',
    content: a.content,
    waitForTimeChange: a.waitForTimeChange,
  });
}

export interface WriteReplyArgs {
  cmtEl: br.Element;
  content: string;
  waitForTimeChange?: boolean;
  shownCb?: () => Promise<void>;
}

export async function writeReply(p: br.Page, a: WriteReplyArgs) {
  await a.cmtEl.$linkButton('Reply').click();

  await waitForOverlayVisible(p);
  if (a.shownCb) {
    await a.shownCb();
  }
  await updateEditorNTC(p, {
    part: 'content',
    content: a.content,
    waitForTimeChange: a.waitForTimeChange,
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

  await updateEditorTC(p, { part: 'content', content: a.content });
}

export function clickMoreCmts(cmtApp: br.Element) {
  return cmtApp.$linkButton(loadMoreCmtsText).click();
}

export function noMoreCmts(cmtApp: br.Element) {
  return cmtApp.$linkButton(loadMoreCmtsText).shouldNotExist();
}

export function clickMoreReplies(cmtApp: br.Element) {
  return cmtApp.$linkButton(loadMoreRepliesText).click();
}

export function clickRepliesButton(cmtEl: br.Element) {
  return cmtEl.$(`${cm.repliesBtnClass} link-button`).click();
}
