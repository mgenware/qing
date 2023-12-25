/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import {
  TestCmtEditorDismissalArgs,
  testCmtEditorDismissal,
} from 'cmt/tests/dismissEditorTests.js';
import * as act from '../cmt/actions.js';
import * as cm from '../cmt/common.js';
import * as def from 'base/def.js';
import postCmtFixture from 'post/postCmtFixture.js';

type Options = Omit<TestCmtEditorDismissalArgs, 'discardChanges'>;

const newCmtOptions: Options = {
  name: 'New cmt',
  overlayPrefixSel: 'root-cmt-list',
  action: async (_, cmtApp) => {
    await cmtApp.$qingButton('Write a comment').click();
    return null;
  },
};

const newReplyOptions: Options = {
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
};

const editCmtOptions: Options = {
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
};

test('Dismiss - New cmt - Keep changes', async ({ page }) =>
  testCmtEditorDismissal(postCmtFixture, page, {
    ...newCmtOptions,
    discardChanges: false,
  }));

test('Dismiss - New cmt - Discard changes', async ({ page }) =>
  testCmtEditorDismissal(postCmtFixture, page, {
    ...newCmtOptions,
    discardChanges: true,
  }));

test('Dismiss - New reply - Keep changes', async ({ page }) =>
  testCmtEditorDismissal(postCmtFixture, page, {
    ...newReplyOptions,
    discardChanges: false,
  }));

test('Dismiss - New reply - Discard changes', async ({ page }) =>
  testCmtEditorDismissal(postCmtFixture, page, {
    ...newReplyOptions,
    discardChanges: true,
  }));

test('Dismiss - Edit a cmt - Keep changes', async ({ page }) =>
  testCmtEditorDismissal(postCmtFixture, page, {
    ...editCmtOptions,
    discardChanges: false,
  }));

test('Dismiss - Edit a cmt - Discard changes', async ({ page }) =>
  testCmtEditorDismissal(postCmtFixture, page, {
    ...editCmtOptions,
    discardChanges: true,
  }));
