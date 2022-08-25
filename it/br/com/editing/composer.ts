/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import * as alt from '../overlays/alert';
import * as btn from '../buttons/button';
import * as cm from './common';
import * as ov from '../overlays/overlay';
import * as ed from './editor';
import { waitForDBTimeChange } from 'base/delay';
import * as spn from '../spinners/spinner';

export interface UpdateParams {
  title?: string;
  content?: string;
}

export async function updateContent(el: br.Element, e: UpdateParams) {
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
  const overlayEl = page.$(ov.openImmersiveSel);
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);
  await composerEl.e.toBeVisible();
  return { overlayEl, composerEl };
}

export async function waitForClosedComposer(
  page: br.Page,
  action: (() => Promise<unknown>) | null,
) {
  await Promise.all([
    page.$(ov.openImmersiveSel).waitForDetached(),
    action ? action() : Promise.resolve(),
  ]);
}

export interface ComposerShouldAppearArgs {
  name: string;
  // `null` indicates the title bar is not visible.
  title: string | null;
  contentHTML: string;
  buttons: btn.ButtonTraits[];
}

export async function shouldAppear(page: br.Page, args: ComposerShouldAppearArgs) {
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

  await Promise.all(args.buttons.map((tr, i) => btn.shouldAppear(btnsEl.item(i), tr)));
}

export async function shouldBeDismissed(page: br.Page, cancelBtn: string) {
  const { composerEl } = await waitForVisibleComposer(page);
  await waitForClosedComposer(page, () => clickBtn(composerEl, cancelBtn));
}

export interface DiscardChangesParams {
  p: br.Page;
  cancelBtn: string;
  title?: string;
  content?: string;
}

export async function shouldDiscardChanges(el: br.Element, e: DiscardChangesParams) {
  await clickBtn(el, e.cancelBtn);
  const alertBtns = await alt.waitFor(e.p, {
    title: 'Do you want to discard your changes?',
    content: "You haven't saved your changes.",
    type: alt.AlertType.warning,
    buttons: alt.AlertButtons.YesNo,
    focusedBtn: 1,
  });

  // Click the No button.
  await waitForClosedComposer(e.p, () => alertBtns.item(1).click());
}

export interface UpdateAndSaveParams {
  spinnerText: string;
  saveBtnText: string;
  dbTimeChange?: boolean;
  title?: string;
  content?: string;
}

export async function updateAndSave(p: br.Page, e: UpdateAndSaveParams) {
  const overlayEl = p.$(ov.openImmersiveSel);
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);

  if (e.dbTimeChange) {
    await waitForDBTimeChange();
  }

  // Update editor content.
  await updateContent(composerEl, { title: e.title, content: e.content });

  // Update button is always the first button.
  const btnEl = composerEl.$qingButton(e.saveBtnText);
  await Promise.all([
    spn.waitForGlobal(p, e.spinnerText, () => btnEl.click()),
    waitForClosedComposer(p, null),
  ]);
}
