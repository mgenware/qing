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
  editBtn: brt.Locator;
  deleteBtn: brt.Locator;
}

async function getEditBarEl(
  expect: brt.Expect,
  rootEl: brt.Locator,
  entityType: number,
  eid: string,
  uid: string,
) {
  const el = rootEl.locator(`#edit-bar-${entityType}-${eid}`).first();
  await expect(el).toBeVisible();
  await expect(el.getAttribute('uid')).toBe(uid);
  return el;
}

async function getButton(expect: brt.Expect, el: brt.Locator, text: string) {
  const btn = el.locator(`a:has-text("${text}")`);
  await expect(btn).toBeVisible();
  return btn;
}

export async function checkEditBar(
  expect: brt.Expect,
  rootEl: brt.Locator,
  entityType: number,
  eid: string,
  uid: string,
): Promise<EditBarButtons> {
  const el = await getEditBarEl(expect, rootEl, entityType, eid, uid);
  const editBtn = await getButton(expect, el, editText);
  const deleteBtn = await getButton(expect, el, deleteText);
  return { editBtn, deleteBtn };
}
