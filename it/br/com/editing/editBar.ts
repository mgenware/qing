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

function getEl(rootEl: br.Element, uid: string) {
  return rootEl.$(`edit-bar-app[uid="${uid}"]`);
}

export function getEditButton(el: br.Element, uid: string) {
  return getEl(el, uid).$linkButton(editText);
}

export function getDeleteButton(el: br.Element, uid: string) {
  return getEl(el, uid).$linkButton(deleteText);
}

export async function shouldAppear(el: br.Element, uid: string) {
  const edit = getEditButton(el, uid);
  const del = getDeleteButton(el, uid);
  await edit.e.toBeVisible();
  await del.e.toBeVisible();
}
