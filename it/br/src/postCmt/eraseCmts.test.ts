/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test } from '@playwright/test';
import { testEraseCmts } from 'cmt/tests/eraseCmtTests.js';
import postCmtFixture from 'post/postCmtFixture.js';

test('Erase fresh cmts', async ({ page }) => testEraseCmts(postCmtFixture, page, true));
test('Erase stale cmts', async ({ page }) => testEraseCmts(postCmtFixture, page, false));
