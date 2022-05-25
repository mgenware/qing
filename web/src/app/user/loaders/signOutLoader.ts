/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as authRoute from '@qing/routes/d/s/pri/auth';

export default class SignOutLoader extends Loader<undefined> {
  override requestURL(): string {
    return authRoute.signOut;
  }
}
