/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';
import 'ui/forms/cardSelector';
import { CardSelectorItem } from 'ui/forms/cardSelector.js';

export const siteTypeOptions: CardSelectorItem[] = [
  {
    value: appdef.SiteType.default,
    title: globalThis.mxLS.siteTypeBlog,
    desc: globalThis.mxLS.siteTypeBlogDesc,
  },
  {
    value: appdef.SiteType.community,
    title: globalThis.mxLS.siteTypeCommunity,
    desc: globalThis.mxLS.siteTypeCommunityDesc,
  },
  {
    value: appdef.SiteType.forums,
    title: globalThis.mxLS.siteTypeForums,
    desc: globalThis.mxLS.siteTypeForumsDesc,
  },
];
