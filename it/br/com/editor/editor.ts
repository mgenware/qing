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

const closedOverlayID = 'qing-overlay.immersive';
const openOverlayID = `${closedOverlayID}[open=""]`;
const composerID = '#composer';
const editorButtonsGroup = '.editor-buttons';

export enum EditorPart {
  content,
  title,
}

async function updateEditorContent(part: EditorPart, composerEl: brt.Element) {
  const editorEl = await composerEl.$('#editor').shouldBeVisible();
  switch (part) {
    case EditorPart.content: {
      const contentEl = await editorEl.$('.kx-content').shouldBeVisible();
      await contentEl.fill(defs.sd.updatedContentRaw);
      break;
    }

    case EditorPart.title: {
      const inputEl = await composerEl.$('input-view input').shouldBeVisible();
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

async function waitForOverlayVisible(page: brt.Page) {
  const overlayEl = await page.$(openOverlayID).waitForAttached();
  const composerEl = await overlayEl.$(composerID).shouldBeVisible();
  return { overlayEl, composerEl };
}

async function waitForOverlayClosed(page: brt.Page) {
  const overlayEl = page.$(closedOverlayID);
  await overlayEl.shouldExist();
}

export async function checkEditorUpdate(
  page: brt.Page,
  part: EditorPart,
  okBtn: string,
  cancelBtn: string | null,
) {
  const { composerEl } = await waitForOverlayVisible(page);

  // Check bottom buttons.
  const btnGroup = await composerEl.$(editorButtonsGroup).shouldBeVisible();
  const btns = await btnGroup.$$('qing-button').shouldHaveCount(2);
  btns.expect((await btns.item(0).innerText()).trim()).toBe(okBtn);
  const okBtnEl = await composerEl.$(`qing-button:has-text("${okBtn}")`).shouldExist();
  if (cancelBtn) {
    await composerEl.$(`qing-button:has-text("${cancelBtn}")`).shouldExist();
  }

  // Update editor content.
  await updateEditorContent(part, composerEl);

  // Click the update button.
  await okBtnEl.click();
  await waitForGlobalSpinner(page);
}

export async function checkEditorDismissal(page: brt.Page, cancelBtn: string) {
  const { composerEl } = await waitForOverlayVisible(page);
  await clickBtn(composerEl, cancelBtn);
  await waitForOverlayClosed(page);
}

export async function checkDiscardedChanges(page: brt.Page, part: EditorPart, cancelBtn: string) {
  const { composerEl } = await waitForOverlayVisible(page);
  await updateEditorContent(part, composerEl);
  await clickBtn(composerEl, cancelBtn);

  const alertBtns = await checkVisibleAlert(
    page,
    'Do you want to discard your changes?',
    "You haven't saved your changes.",
    AlertType.warning,
    AlertButtons.YesNo,
    1,
  );

  // Click the No button.
  await alertBtns.item(1).click();

  await waitForOverlayClosed(page);
}
