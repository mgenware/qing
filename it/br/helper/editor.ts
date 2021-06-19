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
import { checkVisibleAlertAsync } from './alert';

const overlayID = 'qing-overlay.immersive[open]';
const composerID = '#composer';
const editorButtonsGroup = '.editor-buttons';

export enum EditorPart {
  content,
  title,
}

async function updateEditorContentAsync(part: EditorPart, composerEl: testing.ElementHandle) {
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
}

async function clickBtnAsync(composerEl: testing.ElementHandle, btnText: string) {
  const btnEl = await composerEl.$(`${editorButtonsGroup} qing-button:has-text("${btnText}")`);
  ass.t(btnEl);
  await btnEl.click();
}

async function checkOverlayClosedAsync(overlayEl: testing.ElementHandle) {
  ass.e(await overlayEl.getAttribute('open'), '');
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
  const btnGroup = await composerEl.$(editorButtonsGroup);
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
  await updateEditorContentAsync(part, composerEl);

  // Click the update button.
  await okBtnEl.click();
  await waitForGlobalSpinnerAsync(page);
}

export async function checkEditorDismissalAsync(page: testing.Page, cancelBtn: string) {
  const { composerEl, overlayEl } = await waitForOverlayAsync(page);
  await clickBtnAsync(composerEl, cancelBtn);
  await checkOverlayClosedAsync(overlayEl);
}

export async function checkDiscardedChangesAsync(
  page: testing.Page,
  part: EditorPart,
  cancelBtn: string,
) {
  const { composerEl, overlayEl } = await waitForOverlayAsync(page);
  await updateEditorContentAsync(part, composerEl);

  await clickBtnAsync(composerEl, cancelBtn);
  await checkOverlayClosedAsync(overlayEl);
}
