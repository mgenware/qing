/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post';
import * as br from 'br';
import { CmtFixture, CmtFixtureStartOptions, CmtFixtureStartCbArg } from 'br/cmt/fixture';
import { newUser } from 'helper/user';

export const cmtAppSelector = 'post-payload-app cmt-app';

export class PostCmtFixture extends CmtFixture {
  override start(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureStartCbArg) => void,
  ): Promise<void> {
    if (opt.author === 'new') {
      return newUser((u) => this.startInternal(p, opt, u, cb));
    }
    return this.startInternal(p, opt, null, cb);
  }

  private startInternal(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    userNew: br.User | null,
    cb: (arg: CmtFixtureStartCbArg) => void,
  ) {
    const author = userNew ?? (opt.author as br.User | undefined) ?? br.usr.user;
    // NOTE: The post is always created by `usr.user`.
    // But it can be viewed by another user, which is defined as `arg.user`.
    return newPost(author, async ({ link }) => {
      let viewerUser: br.User | null;
      if (opt.viewer === 'new') {
        viewerUser = userNew;
        if (!viewerUser) {
          throw new Error('No user created');
        }
      } else {
        viewerUser = opt.viewer ?? null;
      }
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
