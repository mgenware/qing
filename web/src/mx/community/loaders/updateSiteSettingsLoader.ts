/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as adminRoute from 'routes/s/admin';

export default class UpdateSiteSettingsLoader extends Loader<void> {
  constructor(public key: string, public settings: unknown) {
    super();
  }

  requestURL(): string {
    return adminRoute.updateSiteSettings;
  }

  requestParams(): Record<string, unknown> {
    return {
      settings: {
        [this.key]: JSON.stringify(this.settings),
      },
    };
  }
}
