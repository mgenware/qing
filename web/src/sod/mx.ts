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

export interface SiteSTBase {
  needRestart?: boolean;
}

export interface GetSiteGeneralST extends SiteSTBase {
  siteURL?: string;
  siteType?: number;
  siteName?: string;
  langs?: string[];
}

export interface SetSiteInfoSTData {
  siteURL?: string;
  siteName?: string;
}
