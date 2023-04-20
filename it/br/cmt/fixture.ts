/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

export interface CmtFixtureStartOptions {
  // Defaults to `usr.user`.
  author?: br.User | 'new';
  // Defaults to undefined (visitor).
  viewer?: br.User | 'new';
}

export class CmtFixtureEnv {
  constructor(
    public fixture: CmtFixture,
    public p: br.Page,
    public author: br.User,
    public viewer: br.User | null,
  ) {}

  getCmtApp(): Promise<br.Element> {
    return this.fixture.getCmtApp(this.p);
  }
}

export abstract class CmtFixture {
  abstract start(
    p: br.Page,
    opt: CmtFixtureStartOptions,
    cb: (arg: CmtFixtureEnv) => void,
  ): Promise<void>;

  abstract getCmtApp(p: br.Page): Promise<br.Element>;
}
