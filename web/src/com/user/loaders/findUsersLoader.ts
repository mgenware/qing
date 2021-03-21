/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { CHECK } from 'checks';
import Loader from 'lib/loader';
import UserInfo from '../userInfo';
import routes from 'routes';

export default class FindUsersLoader extends Loader<UserInfo[]> {
  constructor(public byID: boolean, public value: string) {
    super();
    CHECK(value);
  }

  requestURL(): string {
    return routes.s.pri.user.findUsers;
  }

  requestParams(): Record<string, unknown> {
    return {
      byID: +this.byID,
      value: this.value,
    };
  }
}
