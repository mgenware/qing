/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';
import 'ui/forms/cardSelector';
import { CardSelectorItem } from 'ui/forms/cardSelector';

export const siteTypeOptions: CardSelectorItem[] = [
  {
    value: appdef.SiteType.blog,
    title: globalThis.coreLS.siteTypeBlog,
    desc: globalThis.coreLS.siteTypeBlogDesc,
  },
  {
    value: appdef.SiteType.community,
    title: globalThis.coreLS.siteTypeCommunity,
    desc: globalThis.coreLS.siteTypeCommunityDesc,
  },
  {
    value: appdef.SiteType.forums,
    title: globalThis.coreLS.siteTypeForums,
    desc: globalThis.coreLS.siteTypeForumsDesc,
  },
];
