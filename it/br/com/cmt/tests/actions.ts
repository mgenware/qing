/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User } from 'br';
import { editorShouldAppear } from 'br/com/editor/editor';
import { updateEditor } from 'br/com/editor/actions';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { buttonShouldAppear } from 'br/com/buttons/button';

const loadMoreCmtText = 'Load more comments';

export interface WriteCmtArgs {
  cmtApp: brt.Element;
  content: string;
}

export async function writeCmt(p: brt.Page, e: WriteCmtArgs, checkVisuals: boolean) {
  const writeCmtBtn = await buttonShouldAppear(e.cmtApp.$('qing-button'), {
    text: 'Write a comment',
    style: 'success',
  });
  await writeCmtBtn.click();
  if (checkVisuals) {
    await editorShouldAppear(p, {
      name: 'Write a comment',
      title: null,
      contentHTML: '',
      buttons: [{ text: 'Send', style: 'success' }, { text: 'Cancel' }],
    });
  }

  await updateEditor(p, { part: 'content', content: e.content });
}

export interface EditCmtArgs {
  cmtApp: brt.Element;
  author: User;
  content: string;
  // Properties needed when `test` is true.
  contentHTMLTest?: string;
}

export async function editCmt(p: brt.Page, e: EditCmtArgs, checkVisuals: boolean) {
  await getEditBarEditButton(e.cmtApp, e.author.id).click();
  if (checkVisuals) {
    await editorShouldAppear(p, {
      name: 'Edit comment',
      title: null,
      contentHTML: e.contentHTMLTest ?? '',
      buttons: [{ text: 'Edit', style: 'success' }, { text: 'Cancel' }],
    });
  }

  await updateEditor(p, { part: 'content', content: e.content });
}

export function clickMoreCmt(cmtApp: brt.Element) {
  return cmtApp.$linkButton(loadMoreCmtText).click();
}

export function noMoreCmts(cmtApp: brt.Element) {
  return cmtApp.$linkButton(loadMoreCmtText).shouldNotExist();
}
