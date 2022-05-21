/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { AlertButtons, AlertType, alertShouldAppear } from '../alerts/alert';
import { buttonShouldAppear, ButtonTraits } from '../buttons/button';
import * as cm from './common';

export type EditorPart = 'content' | 'title';

export async function updateEditorContent(el: br.Element, part: EditorPart, content: string) {
  switch (part) {
    case 'content': {
      const contentEl = el.$(cm.editorContentSel);
      await contentEl.fill(content);
      break;
    }

    case 'title': {
      const inputEl = el.$(cm.editorTitleSel);
      await inputEl.fill(content);
      break;
    }
    default:
      throw new Error(`Unknown editor part ${part}`);
  }
}

export function getComposerEl(overlay: br.Element) {
  return overlay.$('#composer');
}

async function clickBtn(composerEl: br.Element, btnText: string) {
  const btnEl = composerEl.$hasText(`${cm.editorButtonsGroupSel} qing-button`, btnText);
  await btnEl.click();
}

export async function waitForOverlayVisible(page: br.Page) {
  const overlayEl = await page.$(cm.openOverlaySel).waitForAttached();
  const composerEl = await getComposerEl(overlayEl).shouldBeVisible();
  return { overlayEl, composerEl };
}

export async function waitForOverlayClosed(page: br.Page) {
  const overlayEl = page.$(cm.openOverlaySel);
  await overlayEl.shouldNotExist();
}

export interface EditorShouldAppearArgs {
  name: string;
  // `null` indicates the title bar is not visible.
  title: string | null;
  contentHTML: string;
  buttons: ButtonTraits[];
}

export async function editorShouldAppear(page: br.Page, args: EditorShouldAppearArgs) {
  const { composerEl, overlayEl } = await waitForOverlayVisible(page);

  // Dialog name.
  await overlayEl.$('h2').shouldHaveTextContent(args.name);

  // Title value.
  if (args.title) {
    const titleInputEl = await composerEl.$(cm.editorTitleSel).shouldBeVisible();
    await titleInputEl.shouldHaveAttr('value', args.title);
  } else {
    await composerEl.$(cm.editorTitleSel).shouldNotExist();
  }

  const contentInputEl = await composerEl.$(cm.editorContentSel).shouldBeVisible();
  await contentInputEl.shouldHaveHTMLContent(args.contentHTML || '<p><br></p>');

  // Check bottom buttons.
  const btnGroupEl = await composerEl.$(cm.editorButtonsGroupSel).shouldBeVisible();
  const btnsEl = await btnGroupEl.$$('qing-button').shouldHaveCount(args.buttons.length);

  await Promise.all(args.buttons.map((tr, i) => buttonShouldAppear(btnsEl.item(i), tr)));
}

export async function editorShouldBeDismissed(page: br.Page, cancelBtn: string) {
  const { composerEl } = await waitForOverlayVisible(page);
  await clickBtn(composerEl, cancelBtn);
  await waitForOverlayClosed(page);
}

export async function editorShouldDiscardChanges(
  page: br.Page,
  part: EditorPart,
  cancelBtn: string,
) {
  const { composerEl } = await waitForOverlayVisible(page);
  await updateEditorContent(composerEl, part, '_CHANGES_DISCARDED_');
  await clickBtn(composerEl, cancelBtn);

  const alertBtns = await alertShouldAppear(page, {
    title: 'Do you want to discard your changes?',
    content: "You haven't saved your changes.",
    type: AlertType.warning,
    buttons: AlertButtons.YesNo,
    focusedBtn: 1,
  });

  // Click the No button.
  await alertBtns.item(1).click();

  await waitForOverlayClosed(page);
}
