/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import UserInfo from 'com/user/userInfo.js';
import * as adminRoute from '@qing/routes/s/admin.js';
import { CHECK } from 'checks.js';

export default class SetAdminLoader extends Loader<UserInfo[]> {
  constructor(public targetUser: string, public value: boolean) {
    super();
    CHECK(targetUser);
  }

  override requestURL(): string {
    return adminRoute.setAdmin;
  }

  override requestParams(): Record<string, unknown> {
    return {
      target_user_id: this.targetUser,
      value: +this.value,
    };
  }
}
