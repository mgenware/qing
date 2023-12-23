/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import {
  testCreateReplies,
  testCreateRepliesWithDedup,
  testCreateRepliesWithPagination,
} from 'br/cmt/tests/createReplyTests.js';
import postCmtFixture from 'br/post/postCmtFixture.js';

test('Create and view a fresh reply, default ordering, expanded', async ({ page }) =>
  testCreateReplies(postCmtFixture, page, true));

test('Create and view a stale reply, default ordering, expanded', async ({ page }) =>
  testCreateReplies(postCmtFixture, page, false));

test('Create replies, pagination', async ({ page }) =>
  testCreateRepliesWithPagination(postCmtFixture, page));

test('Create replies, dedup', async ({ page }) => testCreateRepliesWithDedup(postCmtFixture, page));
