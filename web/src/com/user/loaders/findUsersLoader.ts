/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CHECK } from 'checks.js';
import Loader from 'lib/loader.js';
import UserInfo from '../userInfo.js';
import * as userRoute from '@qing/routes/s/pri/user.js';

export default class FindUsersLoader extends Loader<UserInfo[]> {
  constructor(public byID: boolean, public value: string) {
    super();
    CHECK(value);
  }

  override requestURL(): string {
    return userRoute.findUsers;
  }

  override requestParams(): Record<string, unknown> {
    return {
      byID: +this.byID,
      value: this.value,
    };
  }
}
