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

function getEditBarEl(rootEl: brt.Element, uid: string) {
  return rootEl.$(`edit-bar-app[uid="${uid}"]`);
}

export function getEditBarEditButton(el: brt.Element, uid: string) {
  return getEditBarEl(el, uid).$linkButton(editText);
}

export function getEditBarDeleteButton(el: brt.Element, uid: string) {
  return getEditBarEl(el, uid).$linkButton(deleteText);
}

export async function editBarShouldAppear(el: brt.Element, uid: string) {
  const edit = getEditBarEditButton(el, uid);
  const del = getEditBarDeleteButton(el, uid);
  await edit.shouldBeVisible();
  await del.shouldBeVisible();
}
