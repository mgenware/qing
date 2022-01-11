/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { scPost } from 'helper/post';
import { usr } from 'br';
import * as brt from 'brt';
import testCmt from 'br/com/cmt/test';
import { CmtFixture, FixtureStartArg } from 'br/com/cmt/fixture';
import { cmtAppSelector } from './common';

class PostCmtFixture extends CmtFixture {
  override start(arg: FixtureStartArg, cb: () => void): Promise<void> {
    // NOTE: The post is always created by `usr.user`.
    // But it can be viewed by another user, which is defined as `arg.user`.
    return scPost(usr.user, async ({ link }) => {
      await arg.page.goto(link, arg.user);
      return cb();
    });
  }

  override async getCmtApp(page: brt.Page): Promise<brt.Element> {
    return page.$(cmtAppSelector);
  }
}

testCmt('Post', new PostCmtFixture());
