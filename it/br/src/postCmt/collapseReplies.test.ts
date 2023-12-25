/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from '@playwright/test';
import {
  testAddAndExpandReplies,
  testCollapseAndExpandReplies,
} from 'cmt/tests/collapseReplies.js';
import postCmtFixture from 'post/postCmtFixture.js';

test('Collapse and expand replies', async ({ page }) =>
  testCollapseAndExpandReplies(postCmtFixture, page));

test('Adding a reply automatically expands the replies', async ({ page }) =>
  testAddAndExpandReplies(postCmtFixture, page));
