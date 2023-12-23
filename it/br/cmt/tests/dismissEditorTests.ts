/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as cm from '../common.js';
import * as br from 'br.js';
import * as def from 'base/def.js';
import * as cps from 'br/cm/editing/composer.js';
import { Page } from '@playwright/test';
import { CmtFixture } from '../fixture.js';

export interface TestCmtEditorDismissalArgs {
  name: string;
  // The cmt element to check after overlay is closed.
  // Returns `null` if it's writing a new cmt.
  action: (p: br.Page, cmtApp: br.Element) => Promise<br.Element | null>;
  overlayPrefixSel: string;
  discardChanges: boolean;
}

async function testDiscardChanges(w: CmtFixture, p: br.Page, e: TestCmtEditorDismissalArgs) {
  const cmtEl = await e.action(p, await w.getCmtApp(p));

  const { overlayEl } = await cps.waitForOverlay(p, e.overlayPrefixSel);
  await cps.updateContent(overlayEl, { content: def.sd.updated });
  await cps.shouldDiscardChangesOrNot(overlayEl, e.discardChanges, { p, cancelBtn: 'Cancel' });

  if (e.discardChanges) {
    if (cmtEl) {
      // Verify cmt content.
      await cm.shouldAppear({
        cmtEl,
        highlighted: true,
        canEdit: true,
        content: def.sd.content,
        author: br.usr.user,
      });
    }
  } else {
    await cps.shouldAppear(overlayEl, { contentHTML: def.sd.updatedViewHTML });
  }
}

export function testCmtEditorDismissal(w: CmtFixture, page: Page, e: TestCmtEditorDismissalArgs) {
  return w.start(page, { viewer: br.usr.user }, async ({ p }) => {
    const cmtEl = await e.action(p, await w.getCmtApp(p));

    const { overlayEl } = await cps.waitForOverlay(p, e.overlayPrefixSel);
    await overlayEl.$qingButton('Cancel').click();
    await overlayEl.waitForHidden();
    if (cmtEl) {
      await cm.shouldAppear({
        cmtEl,
        highlighted: true,
        canEdit: true,
        content: def.sd.content,
        author: br.usr.user,
      });
    }

    await testDiscardChanges(w, p, e);
  });
}
