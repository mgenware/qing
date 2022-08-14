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
  waitForOverlayClosed,
} from './composer';
import { waitForGlobalSpinner } from '../spinners/spinner';
import * as cm from './common';
import * as def from 'base/def';
import * as br from 'br';
import { waitForDBTimeChange } from 'base/delay';

export interface UpdateEditorArgs {
  part: ComposerPart;
  content?: string;
  dbTimeChange?: boolean;
}

export async function updateEditor(p: br.Page, a: UpdateEditorArgs) {
  const overlayEl = p.$(cm.openOverlaySel);
  await overlayEl.waitForAttached();
  const composerEl = getComposerEl(overlayEl);

  if (a.dbTimeChange) {
    await waitForDBTimeChange();
  }

  // Update editor content.
  await updateComposerContent(composerEl, a.part, a.content ?? def.sd.updated);

  // Update button is always the first button.
  const btnEl = composerEl.$('qing-button');
  await btnEl.click();
  await waitForGlobalSpinner(p);
  await waitForOverlayClosed(p);
}
