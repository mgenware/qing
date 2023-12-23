/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import { testDeleteReply } from 'br/cmt/tests/deleteReplyTests.js';
import postCmtFixture from 'br/post/postCmtFixture.js';

test('Delete a fresh reply', async ({ page }) => testDeleteReply(postCmtFixture, page, true));
test('Delete a stale reply', async ({ page }) => testDeleteReply(postCmtFixture, page, false));
