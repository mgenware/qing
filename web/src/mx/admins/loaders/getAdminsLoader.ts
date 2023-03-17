/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import UserInfo from 'com/user/userInfo.js';
import * as adminRoute from '@qing/routes/s/admin.js';

export default class GetAdminsLoader extends Loader<UserInfo[]> {
  override requestURL(): string {
    return adminRoute.admins;
  }
}
