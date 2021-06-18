/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import testing from 'testing';
import * as ass from 'base/ass';
import defs from 'base/defs';
import { waitForGlobalSpinnerAsync } from './spinner';

const overlayID = 'qing-overlay.immersive[open]';
const composerID = '#composer';

export enum EditorPart {
  content,
  title,
}

async function waitForOverlayAsync(page: testing.Page) {
  await page.waitForSelector(overlayID, { state: 'attached' });
  const overlayEl = await page.$(overlayID);
  ass.t(overlayEl);
  const composerEl = await overlayEl.$(composerID);
  ass.t(composerEl);
  return { overlayEl, composerEl };
}

export async function checkEditorUpdateAsync(
  page: testing.Page,
  part: EditorPart,
  okBtn: string,
  cancelBtn: string | null,
) {
  const { composerEl } = await waitForOverlayAsync(page);

  // Check bottom buttons.
  const btnGroup = await composerEl.$('.editor-buttons');
  ass.t(btnGroup);
  const btns = await btnGroup.$$('qing-button');
  ass.e(btns.length, 2);
  ass.e((await btns[0]?.innerText())?.trim(), okBtn);
  const okBtnEl = await composerEl.$(`qing-button:has-text("${okBtn}")`);
  ass.t(okBtnEl);
  if (cancelBtn) {
    const cancelBtnEl = await composerEl.$(`qing-button:has-text("${cancelBtn}")`);
    ass.t(cancelBtnEl);
    ass.t(await cancelBtnEl.isVisible());
  }

  // Update editor content.
  const editorEl = await composerEl.$('#editor');
  ass.t(editorEl);
  switch (part) {
    case EditorPart.content: {
      const contentEl = await editorEl.$('.kx-content');
      ass.t(contentEl);
      ass.t(await contentEl.isVisible());
      await contentEl.fill(defs.sd.updatedContent);
      break;
    }

    case EditorPart.title: {
      const inputEl = await composerEl.$('input-view input');
      ass.t(inputEl);
      await inputEl.fill(defs.sd.updatedContent);
      break;
    }
    default:
      throw new Error(`Unknown editor part ${part}`);
  }

  // Click the update button.
  await okBtnEl.click();
  await waitForGlobalSpinnerAsync(page);
}

export async function checkEditorCancellationAsync(page: testing.Page, cancelBtn: string) {
  const { composerEl, overlayEl } = await waitForOverlayAsync(page);
  const cancelBtnEl = await composerEl.$(`qing-button:has-text("${cancelBtn}")`);
  ass.t(cancelBtnEl);
  ass.e(await overlayEl.getAttribute('open'), '');
}
