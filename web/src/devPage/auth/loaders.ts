/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import { TUserInfo } from 'sod/dev/auth/tUserInfo';
import routes from '../devRoutes';

export class InLoader extends Loader<void> {
  constructor(public uid: string, public isUidString: boolean) {
    super();
  }

  requestURL(): string {
    return routes.api.auth.in;
  }

  requestParams(): Record<string, unknown> {
    if (!this.isUidString) {
      const id = parseInt(this.uid, 10);
      if (!id) {
        throw new Error(`UID number must be greater than 0. Got ${this.uid}`);
      }
      return { uid_i: id };
    }
    return { uid: this.uid };
  }
}

export class NewUserLoader extends Loader<TUserInfo> {
  requestURL(): string {
    return routes.api.auth.new;
  }
}

export class InfoLoader extends Loader<TUserInfo> {
  uid = '';
  constructor(uid: string) {
    super();
    this.uid = uid;
  }

  requestURL(): string {
    return routes.api.auth.info;
  }

  requestParams(): Record<string, unknown> {
    return {
      uid_i: this.uid,
    };
  }
}
