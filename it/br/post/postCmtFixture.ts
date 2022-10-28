/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import { usr } from 'br';
import * as br from 'br';
import { CmtFixture, FixtureStartOptions } from 'br/cmt/fixture';

export const cmtAppSelector = 'post-payload-app cmt-app';

export class PostCmtFixture extends CmtFixture {
  override start(p: br.Page, arg: FixtureStartOptions, cb: () => void): Promise<void> {
    // NOTE: The post is always created by `usr.user`.
    // But it can be viewed by another user, which is defined as `arg.user`.
    return newPost(usr.user, async ({ link }) => {
      await p.goto(link, arg.user);
      return cb();
    });
  }

  override async getCmtApp(page: br.Page): Promise<br.Element> {
    return Promise.resolve(page.$(cmtAppSelector));
  }

  override getHostURL(p: br.Page) {
    return p.url();
  }
}

export default new PostCmtFixture();
