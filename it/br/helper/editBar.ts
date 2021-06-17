/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ass } from 'base/api';
import testing from 'testing';

const editText = 'Edit';
const deleteText = 'Delete';

export interface EditBarButtons {
  editBtn: testing.ElementHandle;
  deleteBtn: testing.ElementHandle;
}

async function getEditBarEl(
  rootEl: testing.ElementHandle,
  entityType: number,
  eid: string,
  uid: string,
) {
  const el = await rootEl.$(`#edit-bar-${entityType}-${eid}`);
  ass.t(el);
  ass.e(await el.getAttribute('uid'), uid);
  return el;
}

async function getButton(el: testing.ElementHandle, text: string) {
  const btn = await el.$(`a:has-text("${text}")`);
  ass.t(btn);
  return btn;
}

export async function checkEditBarAsync(
  rootEl: testing.ElementHandle,
  entityType: number,
  eid: string,
  uid: string,
): Promise<EditBarButtons> {
  const el = await getEditBarEl(rootEl, entityType, eid, uid);
  const editBtn = await getButton(el, editText);
  const deleteBtn = await getButton(el, deleteText);
  return { editBtn, deleteBtn };
}
