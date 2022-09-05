/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { usr } from 'br';
import * as br from 'br';
import testCmt from 'br/com/cmt/test';
import { CmtFixture, FixtureStartArg } from 'br/com/cmt/fixture';
import { cmtAppSelector } from './common';

class PostCmtFixture extends CmtFixture {
  override start(arg: FixtureStartArg, cb: () => void): Promise<void> {
    // NOTE: The post is always created by `usr.user`.
    // But it can be viewed by another user, which is defined as `arg.user`.
    return newPost(usr.user, async ({ link }) => {
      await arg.p.goto(link, arg.user);
      return cb();
    });
  }

  override async getCmtApp(page: br.Page): Promise<br.Element> {
    return Promise.resolve(page.$(cmtAppSelector));
  }
}

testCmt('Post', new PostCmtFixture());
