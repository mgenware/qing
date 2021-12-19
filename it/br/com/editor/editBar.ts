/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

const editText = 'Edit';
const deleteText = 'Delete';

export interface EditBarButtons {
  editBtn: brt.Element;
  deleteBtn: brt.Element;
}

async function getEditBarEl(rootEl: brt.Element, uid: string) {
  const el = await rootEl.$(`edit-bar-app[uid="${uid}"]`).shouldBeVisible();
  el.expect(await el.getAttribute('uid')).toBe(uid);
  return el;
}

async function getButton(el: brt.Element, text: string) {
  return el.$(`a:has-text("${text}")`).shouldBeVisible();
}

export async function checkEditBar(rootEl: brt.Element, eid: string): Promise<EditBarButtons> {
  const el = await getEditBarEl(rootEl, eid);
  const editBtn = await getButton(el, editText);
  const deleteBtn = await getButton(el, deleteText);
  return { editBtn, deleteBtn };
}
