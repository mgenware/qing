/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { test as base, usr, $ } from 'br';
import * as brt from 'brt';
import { testCmtOnVisitorMode } from 'br/com/cmt/cmt';
import { cmtAppSelector } from './common';

const test = base.extend<{ cmtApp: brt.Element }>({
  cmtApp: async ({ page }, use) => {
    await scPost(usr.user, async ({ link }) => {
      const p = $(page);
      await p.goto(link, null);
      const cmtApp = p.$(cmtAppSelector);
      await use(cmtApp);
    });
  },
});

testCmtOnVisitorMode('[post]', test);
