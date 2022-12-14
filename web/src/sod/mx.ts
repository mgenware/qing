/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /* eslint-disable */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod mx`.
 * See `lib/dev/sod/objects/mx.yaml` for details.
 ******************************************************************************************/

import { NameAndID } from './api.js';

export interface SiteSTBase {
  needRestart?: boolean;
}

export interface GetSiteGeneralST extends SiteSTBase {
  siteURL?: string;
  siteType?: number;
  siteName?: string;
}

export interface GetSiteLangsST extends SiteSTBase {
  supported?: NameAndID[];
  current?: string[];
}

export interface SetSiteInfoSTData {
  siteURL?: string;
  siteName?: string;
}
