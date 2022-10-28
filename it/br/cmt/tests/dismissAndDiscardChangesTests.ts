/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as cm from '../common';
import * as br from 'br';
import * as def from 'base/def';
import * as act from '../actions';
import * as cps from 'br/com/editing/composer';

interface TestWithOverlayParams {
  name: string;
  // The cmt element to check after overlay is closed.
  // Returns `null` if it's writing a new cmt.
  action: (p: br.Page, cmtApp: br.Element) => Promise<br.Element | null>;
  overlayPrefixSel: string;
}

function testWithOverlayEl(w: cm.CmtFixtureWrapper, e: TestWithOverlayParams) {
  w.test(`Dismiss editor - ${e.name}`, { viewer: br.usr.user }, async ({ p }) => {
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
  });

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  testDiscardChanges(w, e, true);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  testDiscardChanges(w, e, false);
}

function testDiscardChanges(
  w: cm.CmtFixtureWrapper,
  e: TestWithOverlayParams,
  discardChanges: boolean,
) {
  w.test(
    `${discardChanges ? 'Discard' : 'Keep'} post editor changes - ${e.name}`,
    { viewer: br.usr.user },
    async ({ p }) => {
      const cmtEl = await e.action(p, await w.getCmtApp(p));

      const { overlayEl } = await cps.waitForOverlay(p, e.overlayPrefixSel);
      await cps.updateContent(overlayEl, { content: def.sd.updated });
      await cps.shouldDiscardChangesOrNot(overlayEl, discardChanges, { p, cancelBtn: 'Cancel' });

      if (discardChanges) {
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
    },
  );
}

export default function testDismissAndDiscardChanges(w: cm.CmtFixtureWrapper) {
  // Test all 3 editors.
  // 1. New cmt.
  testWithOverlayEl(w, {
    name: 'New cmt',
    overlayPrefixSel: 'root-cmt-list',
    action: async (_, cmtApp) => {
      await cmtApp.$qingButton('Write a comment').click();
      return null;
    },
  });
  // 2. New reply.
  testWithOverlayEl(w, {
    name: 'New reply',
    overlayPrefixSel: 'cmt-block',
    action: async (p, cmtApp) => {
      await act.writeCmt(p, {
        cmtApp,
        content: def.sd.content,
      });
      const cmtEl = cm.getTopCmt({ cmtApp });
      await cmtEl.$hasText('cmt-view link-button', 'Reply').click();
      // This is creating a new reply, no need to check anything after changes
      // are discarded. Return null.
      return null;
    },
  });
  // 3. Edit a cmt.
  testWithOverlayEl(w, {
    name: 'Edit cmt',
    overlayPrefixSel: 'cmt-block',
    action: async (p, cmtApp) => {
      await act.writeCmt(p, {
        cmtApp,
        content: def.sd.content,
      });
      const cmtEl = cm.getTopCmt({ cmtApp });
      await cmtEl.$hasText('cmt-view link-button', 'Edit').click();
      return cmtEl;
    },
  });
}
