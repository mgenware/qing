/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import { testDeleteCmt } from 'br/cmt/tests/deleteCmtTests.js';
import postCmtFixture from 'br/post/postCmtFixture.js';

test('Delete a fresh cmt', async ({ page }) => testDeleteCmt(postCmtFixture, page, true));
test('Delete a stale cmt', async ({ page }) => testDeleteCmt(postCmtFixture, page, false));
