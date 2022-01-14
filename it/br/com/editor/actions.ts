import { EditorPart, getComposerEl, updateEditorContent } from './editor';
import { waitForGlobalSpinner } from '../spinners/spinner';
import * as cm from './common';
import * as defs from 'base/defs';
import * as brt from 'brt';

export interface UpdateEditorArgs {
  part: EditorPart;
  content?: string;
}

export async function updateEditor(page: brt.Page, e: UpdateEditorArgs) {
  const overlayEl = await page.$(cm.openOverlaySel).waitForAttached();
  const composerEl = getComposerEl(overlayEl);

  // Update editor content.
  await updateEditorContent(e.part, e.content ?? defs.sd.updated, composerEl);

  // Update button is always the first button.
  const btnEl = composerEl.$('qing-button');
  await btnEl.click();
  await waitForGlobalSpinner(page);
}
