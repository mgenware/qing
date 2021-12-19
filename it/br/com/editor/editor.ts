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
import { buttonShouldAppear, ButtonTraits } from '../buttons/button';

const closedOverlayID = 'qing-overlay.immersive';
const openOverlayID = `${closedOverlayID}[open=""]`;
const composerID = '#composer';
const editorButtonsGroupSel = '.editor-buttons';
const editorContentSel = 'editor-view .kx-content';
const editorTitleSel = 'input[placeholder="Title"]';

export enum EditorPart {
  content,
  title,
}

async function updateEditorContent(part: EditorPart, composerEl: brt.Element) {
  switch (part) {
    case EditorPart.content: {
      const contentEl = composerEl.$(editorContentSel);
      await contentEl.fill(defs.sd.updatedContentRaw);
      break;
    }

    case EditorPart.title: {
      const inputEl = composerEl.$(editorTitleSel);
      await inputEl.fill(defs.sd.updatedContentRaw);
      break;
    }
    default:
      throw new Error(`Unknown editor part ${part}`);
  }
}

async function clickBtn(composerEl: brt.Element, btnText: string) {
  const btnEl = composerEl.$(`${editorButtonsGroupSel} qing-button:has-text("${btnText}")`);
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

export async function editorShouldAppear(
  page: brt.Page,
  title: string,
  contentHTML: string,
  btnTraitsList: ButtonTraits[],
) {
  const { composerEl } = await waitForOverlayVisible(page);

  // Title.
  const titleInputEl = await composerEl.$(editorTitleSel).shouldBeVisible();
  await titleInputEl.shouldHaveAttr('value', title);

  const contentInputEl = await composerEl.$(editorContentSel).shouldBeVisible();
  await contentInputEl.shouldHaveHTMLContent(contentHTML);

  // Check bottom buttons.
  const btnGroupEl = await composerEl.$(editorButtonsGroupSel).shouldBeVisible();
  const btnsEl = await btnGroupEl.$$('qing-button').shouldHaveCount(btnTraitsList.length);

  await Promise.all(btnTraitsList.map((tr, i) => buttonShouldAppear(btnsEl.item(i), tr)));
}

export async function editorShouldUpdate(page: brt.Page, part: EditorPart) {
  const { composerEl } = await waitForOverlayVisible(page);

  // Update editor content.
  await updateEditorContent(part, composerEl);

  // Update button is always the first button.
  const btnEl = composerEl.$('qing-button');
  await btnEl.click();
  await waitForGlobalSpinner(page);
}

export async function editorShouldBeDismissed(page: brt.Page, cancelBtn: string) {
  const { composerEl } = await waitForOverlayVisible(page);
  await clickBtn(composerEl, cancelBtn);
  await waitForOverlayClosed(page);
}

export async function editorShouldDiscardChanges(
  page: brt.Page,
  part: EditorPart,
  cancelBtn: string,
) {
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
