/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import { testEditCmt } from 'cmt/tests/editCmtTests.js';
import postCmtFixture from 'post/postCmtFixture.js';

test('Edit a fresh cmt', async ({ page }) => testEditCmt(postCmtFixture, page, true));
test('Edit a stale cmt', async ({ page }) => testEditCmt(postCmtFixture, page, false));
