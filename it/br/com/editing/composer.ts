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

export function getComposerEl(overlayEl: br.Element) {
  return overlayEl.$('#composer');
}

async function clickBtn(composerEl: br.Element, btnText: string) {
  const btnEl = composerEl.$hasText(`${cm.composerButtonsGroupSel} qing-button`, btnText);
  await btnEl.click();
}

export async function waitForVisibleComposer(page: br.Page, sel: string) {
  const overlayEl = page.$(ov.openImmersiveSel(sel));
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);
  await composerEl.e.toBeVisible();
  return { overlayEl, composerEl };
}

export async function waitForClosedComposer(
  el: br.Element,
  action: (() => Promise<unknown>) | null,
) {
  await Promise.all([el.waitForDetached(), action ? action() : Promise.resolve()]);
}

export interface ComposerShouldAppearArgs {
  name: string;
  // `null` indicates the title bar is not visible.
  title: string | null;
  contentHTML: string;
  buttons: btn.ButtonTraits[];
}

export async function shouldAppear(overlayEl: br.Element, args: ComposerShouldAppearArgs) {
  // Dialog name.
  const h2 = overlayEl.$('h2');
  await h2.e.toHaveText(args.name);

  const composerEl = getComposerEl(overlayEl);

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

export interface DiscardChangesParams {
  p: br.Page;
  cancelBtn: string;
  title?: string;
  content?: string;
}

export async function shouldDiscardChangesOrNot(
  el: br.Element,
  discard: boolean,
  e: DiscardChangesParams,
) {
  await clickBtn(el, e.cancelBtn);
  await alt.waitFor(e.p, {
    title: 'Do you want to discard your changes?',
    content: "You haven't saved your changes.",
    type: alt.AlertType.warning,
    buttons: alt.AlertButtons.YesNo,
    focusedBtn: 1,
  });

  if (discard) {
    await waitForClosedComposer(e.p, () => el.$qingButton('Yes').click());
  } else {
    await el.$qingButton('No').click();
  }
}

export interface UpdateAndSaveArgs {
  p: br.Page;
  spinnerText: string;
  saveBtnText: string;
  dbTimeChange?: boolean;
  title?: string;
  content?: string;
}

export async function updateAndSave(el: br.Element, e: UpdateAndSaveArgs) {
  if (e.dbTimeChange) {
    await waitForDBTimeChange();
  }

  // Update editor content.
  await updateContent(el, { title: e.title, content: e.content });

  // Update button is always the first button.
  const btnEl = el.$qingButton(e.saveBtnText);
  await Promise.all([
    spn.waitForGlobal(e.p, e.spinnerText, () => btnEl.click()),
    waitForClosedComposer(el, null),
  ]);
}
