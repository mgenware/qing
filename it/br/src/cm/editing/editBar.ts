/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
import * as br from 'br.js';

const editText = 'Edit';
const deleteText = 'Delete';

export interface EditBarButtons {
  editBtn: br.BRElement;
  deleteBtn: br.BRElement;
}

function getEl(rootEl: br.BRElement, uid: string) {
  return rootEl.$(`edit-bar-app[uid="${uid}"]`);
}

export function getEditButton(el: br.BRElement, uid: string) {
  return getEl(el, uid).$linkButton(editText);
}

export function getDeleteButton(el: br.BRElement, uid: string) {
  return getEl(el, uid).$linkButton(deleteText);
}

export async function shouldAppear(el: br.BRElement, uid: string) {
  const edit = getEditButton(el, uid);
  const del = getDeleteButton(el, uid);
  await expect(edit.c).toBeVisible();
  await expect(del.c).toBeVisible();
}
