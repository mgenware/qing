/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { getComposerEl, updateComposerContent, waitForClosedComposer } from './composer';
import { waitForGlobalSpinner } from '../spinners/spinner';
import * as ov from '../overlays/overlay';
import * as br from 'br';
import { waitForDBTimeChange } from 'base/delay';

export interface UpdateEditorArgs {
  spinnerText: string;
  dbTimeChange?: boolean;
  title?: string;
  content?: string;
}

export async function updateEditor(p: br.Page, e: UpdateEditorArgs) {
  const overlayEl = p.$(ov.openImmersiveOverlaySel);
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);

  if (e.dbTimeChange) {
    await waitForDBTimeChange();
  }

  // Update editor content.
  await updateComposerContent(composerEl, { title: e.title, content: e.content });

  // Update button is always the first button.
  const btnEl = composerEl.$('qing-button');
  await waitForGlobalSpinner(p, e.spinnerText, () => btnEl.click());
  await waitForClosedComposer(p);
}
