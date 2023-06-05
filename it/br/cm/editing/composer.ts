/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as alt from '../overlays/alert.js';
import * as cm from './common.js';
import * as ov from '../overlays/overlay.js';
import * as ed from './editor.js';
import { waitForDBTimeChange } from 'base/delay.js';

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

export function getElFromOverlay(overlayEl: br.Element) {
  return overlayEl.$('composer-view');
}

async function clickBtn(composerEl: br.Element, btnText: string) {
  const btnEl = composerEl.$hasText(`${cm.composerButtonsGroupSel} qing-button`, btnText);
  await btnEl.click();
}

export async function waitForOverlay(page: br.Page, sel: string) {
  const overlayEl = page.$(ov.openImmersiveSel(sel));
  await overlayEl.waitForAttached();
  const composerEl = getElFromOverlay(overlayEl);
  await composerEl.e.toBeVisible();
  return { overlayEl, composerEl };
}

export interface ComposerShouldAppearArgs {
  name?: string;
  // `null` indicates the title bar is not visible.
  title?: string | null;
  contentHTML?: string;
}

export async function shouldAppear(overlayEl: br.Element, a: ComposerShouldAppearArgs) {
  const el = getElFromOverlay(overlayEl);
  if (a.name) {
    const h2 = el.$('h2');
    await h2.e.toHaveText(a.name);
  }

  if (a.title !== undefined) {
    // Title value.
    if (a.title !== null) {
      const titleInputEl = el.$(cm.composerTitleSel);
      await titleInputEl.e.toBeVisible();
      await titleInputEl.e.toHaveValue(a.title);
    } else {
      await el.$(cm.composerTitleSel).shouldNotExist();
    }
  }
  if (a.contentHTML !== undefined) {
    await ed.shouldHaveContent(
      el,
      a.contentHTML || '<p><br class="ProseMirror-trailingBreak"></p>',
    );
  }
}

export interface DiscardChangesParams {
  p: br.Page;
  cancelBtn: string;
  title?: string;
  content?: string;
}

export async function shouldDiscardChangesOrNot(
  overlayEl: br.Element,
  discard: boolean,
  e: DiscardChangesParams,
) {
  const el = getElFromOverlay(overlayEl);
  await clickBtn(el, e.cancelBtn);
  const dialog = await alt.waitFor(e.p, {
    title: 'Do you want to discard your changes?',
    content: "You haven't saved your changes.",
    type: alt.AlertType.warning,
    focusedBtn: 1,
  });

  if (discard) {
    await dialog.clickYes();
    await el.waitForDetached();
  } else {
    await dialog.clickNo();
  }
}

export interface SaveArgs {
  p: br.Page;
  saveBtnText: string;
}

export interface UpdateAndSaveArgs extends SaveArgs {
  dbTimeChange?: boolean;
  title?: string;
  content?: string;
}

export async function clickSaveButton(overlayEl: br.Element, e: SaveArgs) {
  // Update button is always the first button.
  const btnEl = overlayEl.$qingButton(e.saveBtnText);
  await btnEl.click();
}

export async function updateAndSave(overlayEl: br.Element, e: UpdateAndSaveArgs) {
  if (e.dbTimeChange) {
    await waitForDBTimeChange();
  }
  // Update editor content.
  await updateContent(overlayEl, { title: e.title, content: e.content });
  await clickSaveButton(overlayEl, e);
}
