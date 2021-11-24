/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from '../devRoutes';

export class InLoader extends Loader<void> {
  uid = '';
  constructor(uid: string) {
    super();
    this.uid = uid;
  }

  requestURL(): string {
    return routes.auth.in;
  }

  requestParams(): Record<string, unknown> {
    return {
      uid_i: this.uid,
    };
  }
}

export class NewUserLoader extends Loader<string> {
  requestURL(): string {
    return routes.auth.new;
  }
}

export class InfoLoader extends Loader<void> {
  uid = '';
  constructor(uid: string) {
    super();
    this.uid = uid;
  }

  requestURL(): string {
    return routes.auth.info;
  }

  requestParams(): Record<string, unknown> {
    return {
      uid_i: this.uid,
    };
  }
}
