/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User } from 'br';

export interface FixtureStartArg {
  page: brt.Page;
  user: User | null;
}

export abstract class CmtFixture {
  abstract start(arg: FixtureStartArg, cb: () => void): Promise<void>;
  abstract getCmtApp(page: brt.Page): Promise<brt.Element>;
}
