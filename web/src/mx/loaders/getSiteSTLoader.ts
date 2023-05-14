/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as adminRoute from '@qing/routes/s/admin.js';
import { GetSiteGeneralST, SiteSTBase, GetSiteLangsST } from 'sod/mx.js';
import { appDef } from '@qing/def';

class GetSiteSTLoader<T extends SiteSTBase> extends Loader<T> {
  constructor(public key: appDef.GetSiteSettings) {
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

export class GetGenSiteSTLoader extends GetSiteSTLoader<GetSiteGeneralST> {
  constructor() {
    super(appDef.GetSiteSettings.general);
  }
}

export class GetLangSiteSTLoader extends GetSiteSTLoader<GetSiteLangsST> {
  constructor() {
    super(appDef.GetSiteSettings.langs);
  }
}
