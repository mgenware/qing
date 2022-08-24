/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import {
  ComposerPart,
  getComposerEl,
  updateComposerContent,
  waitForClosedComposer,
} from './composer';
import { waitForGlobalSpinner } from '../spinners/spinner';
import * as ov from '../overlays/overlay';
import * as def from 'base/def';
import * as br from 'br';
import { waitForDBTimeChange } from 'base/delay';

export interface UpdateEditorArgs {
  part: ComposerPart;
  spinnerText: string;
  content?: string;
  dbTimeChange?: boolean;
}

export async function updateEditor(p: br.Page, a: UpdateEditorArgs) {
  const overlayEl = p.$(ov.openImmersiveOverlaySel);
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);

  if (a.dbTimeChange) {
    await waitForDBTimeChange();
  }

  // Update editor content.
  await updateComposerContent(composerEl, a.part, a.content ?? def.sd.updated);

  // Update button is always the first button.
  const btnEl = composerEl.$('qing-button');
  await waitForGlobalSpinner(p, a.spinnerText, () => btnEl.click());
  await waitForClosedComposer(p);
}
