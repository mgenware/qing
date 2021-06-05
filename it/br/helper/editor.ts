/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';
import defs from 'base/defs';
import { waitForGlobalSpinner } from './spinner';

export async function updateEditor(page: testing.Page, okBtn: string, cancelBtn: string | null) {
  const composerEl = await page.$('#composer');
  ass.t(composerEl);
  ass.t(await composerEl.isVisible());

  // Check bottom buttons.
  const okBtnEl = await composerEl.$(`qing-button:has-text("${okBtn}")`);
  ass.t(okBtnEl);
  ass.t(await okBtnEl.isVisible());
  if (cancelBtn) {
    const cancelBtnEl = await composerEl.$(`qing-button:has-text("${cancelBtn}")`);
    ass.t(cancelBtnEl);
    ass.t(await cancelBtnEl.isVisible());
  }

  // Update editor content.
  const editorEl = await composerEl.$('#editor');
  ass.t(editorEl);
  await page.fill('#composer #editor kx-content', defs.defaultUpdatedContent);

  // Click the update button.
  await okBtnEl.click();
  await waitForGlobalSpinner(page);
}
