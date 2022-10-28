/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { User } from 'br';

export interface FixtureStartOptions {
  // Defaults to `usr.user`.
  author?: User;
  // Defaults to undefined (visitor).
  viewer?: User;
}

export abstract class CmtFixture {
  abstract start(p: br.Page, opt: FixtureStartOptions, cb: () => void): Promise<void>;
  abstract getCmtApp(p: br.Page): Promise<br.Element>;
  abstract getHostURL(p: br.Page): string;
}
