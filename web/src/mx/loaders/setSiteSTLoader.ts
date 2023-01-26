/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as adminRoute from '@qing/routes/d/s/admin';
import { SetSiteInfoSTData } from 'sod/mx';
import { appdef } from '@qing/def';

abstract class SetSiteSTLoader<T> extends Loader<T> {
  constructor(public settings: T) {
    super();
  }

  abstract stKey(): number;

  override requestURL(): string {
    return adminRoute.setSiteSettings;
  }

  override requestParams(): Record<string, unknown> {
    return {
      key: this.stKey(),
      stJSON: JSON.stringify(this.settings),
    };
  }
}

export class SetSiteInfoSTLoader extends SetSiteSTLoader<SetSiteInfoSTData> {
  override stKey(): number {
    return appdef.SetSiteSettings.info;
  }
}

export class SetSiteLangsSTLoader extends SetSiteSTLoader<string[]> {
  override stKey(): number {
    return appdef.SetSiteSettings.langs;
  }
}

export class SetSiteTypeSTLoader extends SetSiteSTLoader<number> {
  override stKey(): number {
    return appdef.SetSiteSettings.siteType;
  }
}
