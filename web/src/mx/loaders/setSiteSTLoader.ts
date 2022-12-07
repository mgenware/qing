/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as adminRoute from '@qing/routes/d/s/admin';

export class SetSiteSTLoader<T> extends Loader<T> {
  constructor(public key: number, public settings: T) {
    super();
  }

  override requestURL(): string {
    return adminRoute.updateSiteSettings;
  }

  override requestParams(): Record<string, unknown> {
    return {
      key: this.key,
      stJSON: JSON.stringify(this.settings),
    };
  }
}
