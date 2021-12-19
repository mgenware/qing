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

function getButton(el: brt.Element, text: string) {
  return el.$(`a:has-text("${text}")`);
}

export function getEditButton(el: brt.Element, uid: string) {
  return getButton(getEditBarEl(el, uid), editText);
}

export function getDeleteButton(el: brt.Element, uid: string) {
  return getButton(getEditBarEl(el, uid), deleteText);
}

export async function editBarShouldAppear(el: brt.Element, uid: string) {
  const edit = getEditButton(el, uid);
  const del = getDeleteButton(el, uid);
  await edit.shouldBeVisible();
  await del.shouldBeVisible();
}
