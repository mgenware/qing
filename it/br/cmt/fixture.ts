/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User } from 'br';

export interface CmtFixtureStartOptions {
  // Defaults to `usr.user`.
  author?: User | 'new';
  // Defaults to undefined (visitor).
  viewer?: User | 'new';
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
