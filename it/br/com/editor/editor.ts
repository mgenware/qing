/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { waitForGlobalSpinner } from '../spinners/spinner';
import { AlertButtons, AlertType, alertShouldAppear } from '../alerts/alert';
import { buttonShouldAppear, ButtonTraits } from '../buttons/button';

const closedOverlayID = 'qing-overlay.immersive';
const openOverlayID = `${closedOverlayID}[open=""]`;
const composerID = '#composer';
const editorButtonsGroupSel = '.editor-buttons';
const editorContentSel = 'editor-view .kx-content';
const editorTitleSel = 'input[placeholder="Title"]';

export type EditorPart = 'content' | 'title';

async function updateEditorContent(part: EditorPart, content: string, composerEl: brt.Element) {
  switch (part) {
    case 'content': {
      const contentEl = composerEl.$(editorContentSel);
      await contentEl.fill(content);
      break;
    }

    case 'title': {
      const inputEl = composerEl.$(editorTitleSel);
      await inputEl.fill(content);
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

export interface EditorShouldAppearArgs {
  heading: string;
  // `null` indicates the title bar is not visible.
  titleValue: string | null;
  contentValue: string;
  buttons: ButtonTraits[];
}

export async function editorShouldAppear(page: brt.Page, args: EditorShouldAppearArgs) {
  const { composerEl, overlayEl } = await waitForOverlayVisible(page);

  // Heading
  await overlayEl.$('h2').shouldHaveTextContent(args.heading);

  // Title value.
  if (args.titleValue) {
    const titleInputEl = await composerEl.$(editorTitleSel).shouldBeVisible();
    await titleInputEl.shouldHaveAttr('value', args.titleValue);
  } else {
    await composerEl.$(editorTitleSel).shouldNotExist();
  }

  const contentInputEl = await composerEl.$(editorContentSel).shouldBeVisible();
  await contentInputEl.shouldHaveHTMLContent(args.contentValue || '<p><br></p>');

  // Check bottom buttons.
  const btnGroupEl = await composerEl.$(editorButtonsGroupSel).shouldBeVisible();
  const btnsEl = await btnGroupEl.$$('qing-button').shouldHaveCount(args.buttons.length);

  await Promise.all(args.buttons.map((tr, i) => buttonShouldAppear(btnsEl.item(i), tr)));
}

export async function editorShouldUpdate(page: brt.Page, part: EditorPart, content: string) {
  const composerEl = page.$(composerID);
  // Update editor content.
  await updateEditorContent(part, content, composerEl);

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
  await updateEditorContent(part, '_CHANGES_DISCARDED_', composerEl);
  await clickBtn(composerEl, cancelBtn);

  const alertBtns = await alertShouldAppear(
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
