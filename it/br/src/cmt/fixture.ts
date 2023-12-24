/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page } from '@playwright/test';
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

export interface CmtFixtureStartArg {
  p: br.Page;
  viewer: br.User | null;
  author: br.User;
  fixture: CmtFixture;
}

export abstract class CmtFixture {
  abstract prepare(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureStartArg) => void,
  ): Promise<void>;

  abstract getCmtApp(p: br.Page): Promise<br.Element>;
  abstract getHostURL(p: br.Page): string;

  async start(
    page: Page,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureStartArg) => Promise<void>,
  ) {
    const p = br.$(page);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await this.prepare(p, opt, cb);
  }
}
