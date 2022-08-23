/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { AlertButtons, AlertType, alertShouldAppear } from '../overlays/alert';
import { buttonShouldAppear, ButtonTraits } from '../buttons/button';
import * as cm from './common';
import * as ov from '../overlays/overlay';
import * as ed from './editor';

export type ComposerPart = 'content' | 'title';

export async function updateComposerContent(el: br.Element, part: ComposerPart, content: string) {
  switch (part) {
    case 'content': {
      await ed.fill(el, content);
      break;
    }

    case 'title': {
      const inputEl = el.$(cm.composerTitleSel);
      await inputEl.c.fill(content);
      break;
    }
    default:
      throw new Error(`Unknown composer part ${part}`);
  }
}

export function getComposerEl(overlay: br.Element) {
  return overlay.$('#composer');
}

async function clickBtn(composerEl: br.Element, btnText: string) {
  const btnEl = composerEl.$hasText(`${cm.composerButtonsGroupSel} qing-button`, btnText);
  await btnEl.click();
}

export async function waitForOverlayVisible(page: br.Page) {
  const overlayEl = page.$(ov.openImmersiveOverlaySel);
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);
  await composerEl.e.toBeVisible();
  return { overlayEl, composerEl };
}

export async function waitForOverlayClosed(page: br.Page) {
  await page.$(ov.openImmersiveOverlaySel).waitForDetached();
}

export interface ComposerShouldAppearArgs {
  name: string;
  // `null` indicates the title bar is not visible.
  title: string | null;
  contentHTML: string;
  buttons: ButtonTraits[];
}

export async function composerShouldAppear(page: br.Page, args: ComposerShouldAppearArgs) {
  const { composerEl, overlayEl } = await waitForOverlayVisible(page);

  // Dialog name.
  const h2 = overlayEl.$('h2');
  await h2.e.toHaveText(args.name);

  // Title value.
  if (args.title) {
    const titleInputEl = composerEl.$(cm.composerTitleSel);
    await titleInputEl.e.toBeVisible();
    await titleInputEl.e.toHaveAttribute('value', args.title);
  } else {
    await composerEl.$(cm.composerTitleSel).shouldNotExist();
  }

  await ed.shouldHaveHTML(
    composerEl,
    args.contentHTML || '<p><br class="ProseMirror-trailingBreak"></p>',
  );

  // Check bottom buttons.
  const btnGroupEl = composerEl.$(cm.composerButtonsGroupSel);
  await btnGroupEl.e.toBeVisible();
  const btnsEl = await btnGroupEl.$$('qing-button').shouldHaveCount(args.buttons.length);

  await Promise.all(args.buttons.map((tr, i) => buttonShouldAppear(btnsEl.item(i), tr)));
}

export async function composerShouldBeDismissed(page: br.Page, cancelBtn: string) {
  const { composerEl } = await waitForOverlayVisible(page);
  await clickBtn(composerEl, cancelBtn);
  await waitForOverlayClosed(page);
}

export async function composerShouldDiscardChanges(
  page: br.Page,
  part: ComposerPart,
  cancelBtn: string,
) {
  const { composerEl } = await waitForOverlayVisible(page);
  await updateComposerContent(composerEl, part, '_CHANGES_DISCARDED_');
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
