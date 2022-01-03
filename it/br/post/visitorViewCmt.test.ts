/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { test as base, usr, $ } from 'br';
import * as brt from 'brt';
import { testCmtOnVisitorMode } from 'br/com/cmt/cmt';
import { cmtAppSelector, postLink } from './common';

const test = base.extend<{ cmtApp: brt.Element }>({
  cmtApp: async ({ page }, use) => {
    await newPost(usr.user, async (id) => {
      const link = postLink(id);
      const p = $(page);
      await p.goto(link, null);
      const cmtApp = p.$(cmtAppSelector);
      await use(cmtApp);
    });
  },
});

testCmtOnVisitorMode('[post]', test);
