/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';
import { checkDefaultTimeField } from './timeField';

const editText = 'Edit';
const deleteText = 'Delete';

async function getEditButtonHandle(
  el: testing.ElementHandle,
  name: string,
): Promise<testing.ElementHandle<SVGElement | HTMLElement> | null> {
  return await el.$(`edit-bar-app a:has-text("${name}")`);
}

export async function getEditBarEditButton(el: testing.ElementHandle) {
  return await getEditButtonHandle(el, editText);
}

export async function getEditBarDeleteButton(el: testing.ElementHandle) {
  return await getEditButtonHandle(el, deleteText);
}

export async function checkUserView(
  el: testing.ElementHandle | null,
  id: string,
  iconURL: string,
  name: string,
  hasEditBar: boolean,
) {
  ass.t(el);
  ass.t(await el.isVisible());

  // Profile image link.
  ass.t(await el.$(`a[href="/u/${id}"] img[src="${iconURL}"][width="50"][height="50"]`));
  // Name link.
  ass.t(await el.$(`a[href="/u/${id}"]:has-text("${name}")`));
  // Time field.
  await checkDefaultTimeField(el);
  // Edit bar.
  const editButtons = await Promise.all([
    getEditButtonHandle(el, editText),
    getEditButtonHandle(el, deleteText),
  ]);
  editButtons.forEach((btn) => {
    if (hasEditBar) {
      ass.t(btn);
    } else {
      ass.f(btn);
    }
  });
}
