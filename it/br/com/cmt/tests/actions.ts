/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User } from 'br';
import { editorShouldAppear } from 'br/com/editor/editor';
import { updateEditorNTC, updateEditorTC } from 'br/com/editor/actions';
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

  await updateEditorNTC(p, { part: 'content', content: e.content });
}

export interface EditCmtArgs {
  cmtApp: brt.Element;
  author: User;
  content?: string;
  visuals?: {
    page: brt.Page;
    contentHTML: string;
  };
}

export async function editCmt(cmtApp: brt.Element, a: EditCmtArgs) {
  await getEditBarEditButton(cmtApp, a.author.id).click();
  const v = a.visuals;
  if (v) {
    await editorShouldAppear(v.page, {
      name: 'Edit comment',
      title: null,
      contentHTML: v.contentHTML,
      buttons: [{ text: 'Edit', style: 'success' }, { text: 'Cancel' }],
    });
  }

  await updateEditorTC(v?.page, { part: 'content', content: a.content });
}

export function clickMoreCmt(cmtApp: brt.Element) {
  return cmtApp.$linkButton(loadMoreCmtText).click();
}

export function noMoreCmts(cmtApp: brt.Element) {
  return cmtApp.$linkButton(loadMoreCmtText).shouldNotExist();
}
