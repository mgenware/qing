/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import {
  testCreateCmts,
  testCreateCmtsWithDedup,
  testCreateCmtsWithPagination,
} from 'br/cmt/tests/createCmtTests.js';
import postCmtFixture from 'br/post/postCmtFixture.js';

test('Create and view a fresh cmt, default ordering', async ({ page }) =>
  testCreateCmts(postCmtFixture, page, true));

test('Create and view a stale cmt, default ordering', async ({ page }) =>
  testCreateCmts(postCmtFixture, page, false));

test('Create cmts, pagination', async ({ page }) =>
  testCreateCmtsWithPagination(postCmtFixture, page));

test('Create cmts, dedup', async ({ page }) => testCreateCmtsWithDedup(postCmtFixture, page));
