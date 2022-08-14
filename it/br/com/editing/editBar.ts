/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

const editText = 'Edit';
const deleteText = 'Delete';

export interface EditBarButtons {
  editBtn: br.Element;
  deleteBtn: br.Element;
}

function getEditBarEl(rootEl: br.Element, uid: string) {
  return rootEl.$(`edit-bar-app[uid="${uid}"]`);
}

export function getEditBarEditButton(el: br.Element, uid: string) {
  return getEditBarEl(el, uid).$linkButton(editText);
}

export function getEditBarDeleteButton(el: br.Element, uid: string) {
  return getEditBarEl(el, uid).$linkButton(deleteText);
}

export async function editBarShouldAppear(el: br.Element, uid: string) {
  const edit = getEditBarEditButton(el, uid);
  const del = getEditBarDeleteButton(el, uid);
  await edit.e.toBeVisible();
  await del.e.toBeVisible();
}
