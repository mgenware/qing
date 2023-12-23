/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from 'br.js';
import { testReplyNoti } from 'br/cmt/tests/notiTests.js';
import postCmtFixture from 'br/post/postCmtFixture.js';

test('Replying to a cmt trigger a notification', async ({ page }) =>
  testReplyNoti(postCmtFixture, page));
