/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as adminRoute from '@qing/routes/d/s/admin';
import { appdef } from '@qing/def';
import { SiteGeneralST } from 'sod/mx';

export type SiteSTInputType<T> = Required<Omit<T, 'needRestart'>>;

export class SetSiteSTLoader<T> extends Loader<SiteSTInputType<T>> {
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

export class SetGenSiteSTLoader extends SetSiteSTLoader<SiteGeneralST> {
  constructor(settings: SiteGeneralST) {
    super(appdef.SiteSettings.general, settings);
  }
}
