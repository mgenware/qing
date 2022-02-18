/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import UserInfo from 'com/user/userInfo';
import * as adminRoute from '@qing/routes/s/admin';
import { CHECK } from 'checks';

export default class SetAdminLoader extends Loader<UserInfo[]> {
  constructor(public targetUser: string, public value: boolean) {
    super();
    CHECK(targetUser);
  }

  requestURL(): string {
    return adminRoute.setAdmin;
  }

  requestParams(): Record<string, unknown> {
    return {
      target_user_id: this.targetUser,
      value: +this.value,
    };
  }
}
