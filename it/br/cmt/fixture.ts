/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

export interface CmtFixtureStartOptions {
  // Defaults to `br.usr.user`.
  author?:
    | br.User
    | 'new' // Creates a new user.
    | 'new-bot'; // Creates a new user with `no-noti` flag.
  // Defaults to undefined (visitor).
  viewer?: br.User | 'author'; // Use the same user as `author`.
}

export interface CmtFixtureStartCbArg {
  p: br.Page;
  viewer: br.User | null;
  author: br.User;
}

export abstract class CmtFixture {
  abstract start(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureStartCbArg) => void,
  ): Promise<void>;

  abstract getCmtApp(p: br.Page): Promise<br.Element>;
  abstract getHostURL(p: br.Page): string;
}
