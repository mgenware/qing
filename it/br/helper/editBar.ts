/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ass } from 'base/api';
import testing from 'testing';

export interface EditBarButtons {
  editBtn: testing.ElementHandle;
  deleteBtn: testing.ElementHandle;
}

export async function getEditBarButtons(
  rootEl: testing.ElementHandle,
  entityType: number,
  eid: string,
  uid: string,
): Promise<EditBarButtons> {
  const el = await rootEl.$(`#edit-bar-${entityType}-${eid}`);
  ass.t(el);
  ass.e(await el.getAttribute('uid'), uid);

  const editBtn = await el.$('qing-button:has-text("Edit")');
  ass.t(editBtn);
  const deleteBtn = await el.$('qing-button:has-text("Delete")');
  ass.t(deleteBtn);
  return {
    editBtn,
    deleteBtn,
  };
}
