/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as authRoute from '@qing/routes/s/pub/auth.js';

export default class ForgotPwdLoader extends Loader<void> {
  constructor(public email: string) {
    super();
  }

  override requestURL(): string {
    return authRoute.forgotPwd;
  }

  override requestParams(): Record<string, unknown> {
    return {
      email: this.email,
    };
  }
}
