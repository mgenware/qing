/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newPost } from 'helper/post.js';
import * as br from 'br.js';
import { CmtFixture, CmtFixtureStartOptions, CmtFixtureEnv } from 'br/cmt/fixture.js';
import { newUser } from 'helper/user.js';

export * as cm from '../cmt/common.js';
export * as act from '../cmt/actions.js';

export const cmtAppSelector = 'post-payload-app cmt-app';

export class PostCmtFixture extends CmtFixture {
  override start(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureEnv) => void,
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
    cb: (arg: CmtFixtureEnv) => void,
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
      const e = new CmtFixtureEnv(this, p, author, viewerUser);
      return cb(e);
    });
  }

  override async getCmtApp(page: br.Page): Promise<br.Element> {
    return Promise.resolve(page.$(cmtAppSelector));
  }
}

export const fixture = new PostCmtFixture();
