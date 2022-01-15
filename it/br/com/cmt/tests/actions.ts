/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User } from 'br';
import { editorShouldAppear } from 'br/com/editor/editor';
import { updateEditorNTC, updateEditorTC } from 'br/com/editor/actions';
import { getEditBarEditButton } from 'br/com/editor/editBar';
import { buttonShouldAppear } from 'br/com/buttons/button';

const loadMoreCmtText = 'Load more comments';

export interface WriteCmtArgs {
  cmtApp: br.Element;
  content: string;
  checkVisuals?: boolean;
}

export async function writeCmt(p: br.Page, a: WriteCmtArgs) {
  const writeCmtBtn = await buttonShouldAppear(a.cmtApp.$('qing-button'), {
    text: 'Write a comment',
    style: 'success',
  });
  await writeCmtBtn.click();
  if (a.checkVisuals) {
    await editorShouldAppear(p, {
      name: 'Write a comment',
      title: null,
      contentHTML: '',
      buttons: [{ text: 'Send', style: 'success' }, { text: 'Cancel' }],
    });
  }

  await updateEditorNTC(p, { part: 'content', content: a.content });
}

export interface EditCmtArgs {
  cmtApp: br.Element;
  author: User;
  content?: string;
  visuals?: {
    contentHTML: string;
  };
}

export async function editCmt(page: br.Page, a: EditCmtArgs) {
  await getEditBarEditButton(a.cmtApp, a.author.id).click();
  const v = a.visuals;
  if (v) {
    await editorShouldAppear(page, {
      name: 'Edit comment',
      title: null,
      contentHTML: v.contentHTML,
      buttons: [{ text: 'Edit', style: 'success' }, { text: 'Cancel' }],
    });
  }

  await updateEditorTC(page, { part: 'content', content: a.content });
}

export function clickMoreCmt(cmtApp: br.Element) {
  return cmtApp.$linkButton(loadMoreCmtText).click();
}

export function noMoreCmts(cmtApp: br.Element) {
  return cmtApp.$linkButton(loadMoreCmtText).shouldNotExist();
}
