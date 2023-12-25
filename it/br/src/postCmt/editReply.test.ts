/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from '@playwright/test';
import { testEditReply } from 'cmt/tests/editReplyTests.js';
import postCmtFixture from 'post/postCmtFixture.js';

test('Edit a fresh reply', async ({ page }) => testEditReply(postCmtFixture, page, true));
test('Edit a stale reply', async ({ page }) => testEditReply(postCmtFixture, page, false));
