/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import UserInfo from 'com/user/userInfo';
import * as adminRoute from 'routes/s/admin';

export default class GetAdminsLoader extends Loader<UserInfo[]> {
  requestURL(): string {
    return adminRoute.getAdmins;
  }
}
