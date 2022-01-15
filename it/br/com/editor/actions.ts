import { EditorPart, getComposerEl, updateEditorContent } from './editor';
import { waitForGlobalSpinner } from '../spinners/spinner';
import * as cm from './common';
import * as defs from 'base/defs';
import * as brt from 'brt';
import { waitForMinTimeChange } from 'base/delay';

export interface UpdateEditorArgs {
  part: EditorPart;
  content?: string;
}

// Updates editor without DB time change.
export async function updateEditorNTC(page: brt.Page, a: UpdateEditorArgs) {
  const overlayEl = await page.$(cm.openOverlaySel).waitForAttached();
  const composerEl = getComposerEl(overlayEl);

  // Update editor content.
  await updateEditorContent(composerEl, a.part, a.content ?? defs.sd.updated);

  // Update button is always the first button.
  const btnEl = composerEl.$('qing-button');
  await btnEl.click();
  await waitForGlobalSpinner(page);
}

// Updates editor with DB time change.
export async function updateEditorTC(page: brt.Page, a: UpdateEditorArgs) {
  await updateEditorNTC(page, a);
  await waitForMinTimeChange();
}
