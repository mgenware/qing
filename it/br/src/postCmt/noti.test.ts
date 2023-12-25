/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from '@playwright/test';
import { testReplyNoti } from 'cmt/tests/notiTests.js';
import postCmtFixture from 'post/postCmtFixture.js';

test('Replying to a cmt trigger a notification', async ({ page }) =>
  testReplyNoti(postCmtFixture, page));
