/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as authRoute from '@qing/routes/d/s/pub/auth';

export default class SignUpLoader extends Loader<undefined> {
  constructor(public name: string, public email: string, public pwd: string) {
    super();
  }

  override requestURL(): string {
    return authRoute.signUp;
  }

  override requestParams(): Record<string, unknown> {
    return {
      name: this.name,
      email: this.email,
      pwd: this.pwd,
    };
  }
}