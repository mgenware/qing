/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as adminRoute from '@qing/routes/d/s/admin';
import { SiteGenSettings, SiteSettingsBase } from 'sod/mx';
import { appdef } from '@qing/def';

class GetSiteSTLoader<T extends SiteSettingsBase> extends Loader<T> {
  constructor(public key: appdef.SiteSettings) {
    super();
  }

  override requestURL(): string {
    return adminRoute.siteSettings;
  }

  override requestParams(): Record<string, unknown> {
    return {
      key: this.key,
    };
  }
}

export class GetGenSiteSTLoader extends GetSiteSTLoader<SiteGenSettings> {
  constructor() {
    super(appdef.SiteSettings.gen);
  }
}
