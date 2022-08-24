/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import * as alt from '../overlays/alert';
import { buttonShouldAppear, ButtonTraits } from '../buttons/button';
import * as cm from './common';
import * as ov from '../overlays/overlay';
import * as ed from './editor';

export interface UpdateComposerParams {
  title?: string;
  content?: string;
}

export async function updateComposerContent(el: br.Element, e: UpdateComposerParams) {
  if (e.title) {
    const inputEl = el.$(cm.composerTitleSel);
    await inputEl.c.fill(e.title);
  }
  if (e.content) {
    await ed.fill(el, e.content);
  }
}

export function getComposerEl(overlay: br.Element) {
  return overlay.$('#composer');
}

async function clickBtn(composerEl: br.Element, btnText: string) {
  const btnEl = composerEl.$hasText(`${cm.composerButtonsGroupSel} qing-button`, btnText);
  await btnEl.click();
}

export async function waitForVisibleComposer(page: br.Page) {
  const overlayEl = page.$(ov.openImmersiveOverlaySel);
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);
  await composerEl.e.toBeVisible();
  return { overlayEl, composerEl };
}

export async function waitForClosedComposer(page: br.Page) {
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
  const { composerEl, overlayEl } = await waitForVisibleComposer(page);

  // Dialog name.
  const h2 = overlayEl.$('h2');
  await h2.e.toHaveText(args.name);

  // Title value.
  if (args.title) {
    const titleInputEl = composerEl.$(cm.composerTitleSel);
    await titleInputEl.e.toBeVisible();
    await titleInputEl.e.toHaveValue(args.title);
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
  const { composerEl } = await waitForVisibleComposer(page);
  await clickBtn(composerEl, cancelBtn);
  await waitForClosedComposer(page);
}

export interface DiscardChangesParams {
  cancelBtn: string;
  title?: string;
  content?: string;
}

export async function composerShouldDiscardChanges(page: br.Page, e: DiscardChangesParams) {
  const { composerEl } = await waitForVisibleComposer(page);
  await updateComposerContent(composerEl, { title: e.title, content: e.content });

  await clickBtn(composerEl, e.cancelBtn);
  const alertBtns = await alt.waitForAlert(page, {
    title: 'Do you want to discard your changes?',
    content: "You haven't saved your changes.",
    type: alt.AlertType.warning,
    buttons: alt.AlertButtons.YesNo,
    focusedBtn: 1,
  });

  // Click the No button.
  await alertBtns.item(1).click();

  await waitForClosedComposer(page);
}
