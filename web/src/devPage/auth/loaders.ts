/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import { User } from 'sod/auth.js';
import * as authRoute from '@qing/routes/dev/api/auth.js';

class LoaderBase<T> extends Loader<T> {
  constructor(public uidInput: string, public isEID: boolean) {
    super();
  }

  override requestParams(): Record<string, unknown> {
    if (!this.isEID) {
      const id = parseInt(this.uidInput, 10);
      if (!id) {
        throw new Error(`UID number must be greater than 0. Got ${this.uidInput}`);
      }
      return { uid_i: id };
    }
    return { uid: this.uidInput };
  }
}

export class InLoader extends LoaderBase<void> {
  override requestURL(): string {
    return authRoute.in_;
  }
}

export class NewUserLoader extends Loader<void> {
  override requestURL(): string {
    return authRoute.new_;
  }
}

export class InfoLoader extends LoaderBase<User> {
  override requestURL(): string {
    return authRoute.info;
  }
}

export class CurUserLoader extends Loader<string> {
  override requestURL(): string {
    return authRoute.cur;
  }
}
