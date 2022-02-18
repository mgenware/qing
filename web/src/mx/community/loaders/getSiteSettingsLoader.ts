/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as adminRoute from '@qing/routes/s/admin';

export interface GetSiteSettingsResult {
  settings?: Record<string, unknown>;
  need_restart?: boolean;
}

export default class GetSiteSettingsLoader extends Loader<GetSiteSettingsResult> {
  constructor(public key: string) {
    super();
  }

  requestURL(): string {
    return adminRoute.siteSettings;
  }

  requestParams(): Record<string, unknown> {
    return {
      key: this.key,
    };
  }
}
