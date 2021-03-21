/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';

export default class SignInLoader extends Loader<undefined> {
  constructor(public email: string, public pwd: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pub.auth.signIn;
  }

  requestParams(): Record<string, unknown> {
    return {
      email: this.email,
      pwd: this.pwd,
    };
  }
}
