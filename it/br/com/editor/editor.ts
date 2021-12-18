/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import * as defs from 'base/defs';
import { waitForGlobalSpinner } from '../spinners/spinner';
import { AlertButtons, AlertType, checkVisibleAlert } from '../alerts/alert';

const overlayID = 'qing-overlay.immersive[open]';
const composerID = '#composer';
const editorButtonsGroup = '.editor-buttons';

export enum EditorPart {
  content,
  title,
}

async function updateEditorContent(expect: brt.Expect, part: EditorPart, composerEl: brt.Locator) {
  const editorEl = composerEl.locator('#editor');
  await expect(editorEl).toBeVisible();
  switch (part) {
    case EditorPart.content: {
      const contentEl = editorEl.locator('.kx-content');
      await expect(contentEl).toBeVisible();
      await contentEl.fill(defs.sd.updatedContentRaw);
      break;
    }

    case EditorPart.title: {
      const inputEl = composerEl.locator('input-view input');
      await expect(inputEl).toBeVisible();
      await inputEl.fill(defs.sd.updatedContentRaw);
      break;
    }
    default:
      throw new Error(`Unknown editor part ${part}`);
  }
}

async function clickBtn(composerEl: brt.Locator, btnText: string) {
  const btnEl = composerEl
    .locator(`${editorButtonsGroup} qing-button:has-text("${btnText}")`)
    .first();
  await btnEl.first().click();
}

async function checkOverlayOpen(expect: brt.Expect, overlayEl: brt.Locator, open: boolean) {
  await expect(overlayEl.getAttribute('open')).toBe(open ? '' : null);
}

async function waitForOverlay(expect: brt.Expect, page: brt.Page) {
  await page.waitForSelector(overlayID, { state: 'attached' });
  const overlayEl = page.locator(overlayID).first();
  await expect(overlayEl).toBeVisible();

  await checkOverlayOpen(expect, overlayEl, true);
  const composerEl = overlayEl.locator(composerID).first();
  await expect(composerEl).toBeVisible();
  return { overlayEl, composerEl };
}

export async function checkEditorUpdate(
  expect: brt.Expect,
  page: brt.Page,
  part: EditorPart,
  okBtn: string,
  cancelBtn: string | null,
) {
  const { composerEl } = await waitForOverlay(expect, page);

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
  await updateEditorContent(part, composerEl);

  // Click the update button.
  await okBtnEl.click();
  await waitForGlobalSpinner(page);
}

export async function checkEditorDismissal(page: testing.Page, cancelBtn: string) {
  const { composerEl, overlayEl } = await waitForOverlay(page);
  await clickBtn(composerEl, cancelBtn);
  await checkOverlayOpen(overlayEl, false);
}

export async function checkDiscardedChanges(
  page: testing.Page,
  part: EditorPart,
  cancelBtn: string,
) {
  const { composerEl, overlayEl } = await waitForOverlay(page);
  await updateEditorContent(part, composerEl);
  await clickBtn(composerEl, cancelBtn);

  await checkVisibleAlert(
    page,
    'Do you want to discard your changes?',
    "You haven't saved your changes.",
    AlertType.warning,
    AlertButtons.YesNo,
    1,
  );

  await checkOverlayOpen(overlayEl, false);
}
