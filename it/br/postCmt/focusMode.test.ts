/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import {
  testFocusMode404Cmts,
  testFocusModeCmts,
  testFocusModeReplies,
} from 'br/cmt/tests/focusModeTests.js';
import postCmtFixture from 'br/post/postCmtFixture.js';

test('Focus mode cmts', async ({ page }) => testFocusModeCmts(postCmtFixture, page));
test('Focus mode 404 cmts', async ({ page }) => testFocusMode404Cmts(postCmtFixture, page));
test('Focus mode replies', async ({ page }) => testFocusModeReplies(postCmtFixture, page));
