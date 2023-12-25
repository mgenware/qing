/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import { testNoCmts } from 'cmt/tests/noCmtTests.js';
import postCmtFixture from 'post/postCmtFixture.js';

test('No comments', async ({ page }) => testNoCmts(postCmtFixture, page));
