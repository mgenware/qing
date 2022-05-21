import { EditorPart, getComposerEl, updateEditorContent } from './editor';
import { waitForGlobalSpinner } from '../spinners/spinner';
import * as cm from './common';
import * as def from 'base/def';
import * as br from 'br';
import { waitForMinTimeChange } from 'base/delay';

export interface UpdateEditorArgs {
  part: EditorPart;
  content?: string;
  // Makes sure DB date is updated by waiting for a second.
  waitForTimeChange?: boolean;
}

// Updates editor without DB time change.
export async function updateEditorNTC(p: br.Page, a: UpdateEditorArgs) {
  const overlayEl = await p.$(cm.openOverlaySel).waitForAttached();
  const composerEl = getComposerEl(overlayEl);

  // Update editor content.
  await updateEditorContent(composerEl, a.part, a.content ?? def.sd.updated);

  if (a.waitForTimeChange) {
    await waitForMinTimeChange();
  }

  // Update button is always the first button.
  const btnEl = composerEl.$('qing-button');
  await btnEl.click();
  await waitForGlobalSpinner(p);
}

// Updates editor with DB time change.
export async function updateEditorTC(page: br.Page, a: UpdateEditorArgs) {
  await waitForMinTimeChange();
  await updateEditorNTC(page, a);
}
