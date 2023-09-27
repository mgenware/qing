/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post.js';
import * as br from 'br.js';
import { CmtFixture, CmtFixtureStartOptions, CmtFixtureStartCbArg } from 'br/cmt/fixture.js';
import { newUser } from 'helper/user.js';

export const cmtAppSelector = 'post-payload-app cmt-app';

export class PostCmtFixture extends CmtFixture {
  override start(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureStartCbArg) => void,
  ): Promise<void> {
    if (typeof opt.author === 'string') {
      const noNoti = opt.author === 'new-bot';
      return newUser((u) => this.startInternal(p, opt, u, cb), { noNoti });
    }
    return this.startInternal(p, opt, br.usr.user, cb);
  }

  private startInternal(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    author: br.User,
    cb: (arg: CmtFixtureStartCbArg) => void,
  ) {
    const viewerUser = opt.viewer === 'author' ? author : opt.viewer ?? null;
    return newPost(author, async ({ link }) => {
      await p.goto(link, viewerUser);
      return cb({ p, author, viewer: viewerUser });
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
