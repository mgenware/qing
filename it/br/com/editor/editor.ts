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

async function updateEditorContent(expect: brt.Expect, part: EditorPart, composerEl: brt.Element) {
  const editorEl = composerEl.$('#editor');
  await expect(editorEl).toBeVisible();
  switch (part) {
    case EditorPart.content: {
      const contentEl = editorEl.$('.kx-content');
      await expect(contentEl).toBeVisible();
      await contentEl.fill(defs.sd.updatedContentRaw);
      break;
    }

    case EditorPart.title: {
      const inputEl = composerEl.$('input-view input');
      await expect(inputEl).toBeVisible();
      await inputEl.fill(defs.sd.updatedContentRaw);
      break;
    }
    default:
      throw new Error(`Unknown editor part ${part}`);
  }
}

async function clickBtn(composerEl: brt.Element, btnText: string) {
  const btnEl = composerEl.$(`${editorButtonsGroup} qing-button:has-text("${btnText}")`);
  await btnEl.click();
}

async function checkOverlayOpen(expect: brt.Expect, overlayEl: brt.Element, open: boolean) {
  await expect(overlayEl.getAttribute('open')).toBe(open ? '' : null);
}

async function waitForOverlay(expect: brt.Expect, page: brt.Page) {
  await page.c.waitForSelector(overlayID, { state: 'attached' });
  const overlayEl = page.$(overlayID);
  await expect(overlayEl).toBeVisible();

  await checkOverlayOpen(expect, overlayEl, true);
  const composerEl = overlayEl.$(composerID);
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
  const btnGroup = composerEl.$(editorButtonsGroup);
  await expect(btnGroup).toBeVisible();
  const btns = btnGroup.$$('qing-button');
  expect(btns).toHaveCount(2);
  expect((await btns.item(0).innerText()).trim()).toBe(okBtn);
  const okBtnEl = composerEl.$(`qing-button:has-text("${okBtn}")`);
  await expect(okBtn).toBeVisible();
  if (cancelBtn) {
    const cancelBtnEl = composerEl.$(`qing-button:has-text("${cancelBtn}")`);
    await expect(cancelBtnEl).toBeVisible();
  }

  // Update editor content.
  await updateEditorContent(expect, part, composerEl);

  // Click the update button.
  await okBtnEl.click();
  await waitForGlobalSpinner(page);
}

export async function checkEditorDismissal(expect: brt.Expect, page: brt.Page, cancelBtn: string) {
  const { composerEl, overlayEl } = await waitForOverlay(expect, page);
  await clickBtn(composerEl, cancelBtn);
  await checkOverlayOpen(expect, overlayEl, false);
}

export async function checkDiscardedChanges(
  expect: brt.Expect,
  page: brt.Page,
  part: EditorPart,
  cancelBtn: string,
) {
  const { composerEl, overlayEl } = await waitForOverlay(expect, page);
  await updateEditorContent(expect, part, composerEl);
  await clickBtn(composerEl, cancelBtn);

  await checkVisibleAlert(
    expect,
    page,
    'Do you want to discard your changes?',
    "You haven't saved your changes.",
    AlertType.warning,
    AlertButtons.YesNo,
    1,
  );

  await checkOverlayOpen(expect, overlayEl, false);
}
