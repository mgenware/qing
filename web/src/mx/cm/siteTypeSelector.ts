/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';
import ls from 'ls';
import 'ui/forms/cardSelector';
import { CardSelectorItem } from 'ui/forms/cardSelector';

export const siteTypeOptions: CardSelectorItem[] = [
  { value: appdef.SiteType.blog, title: ls.siteTypeBlog, desc: ls.siteTypeBlogDesc },
  { value: appdef.SiteType.community, title: ls.siteTypeCommunity, desc: ls.siteTypeCommunityDesc },
  { value: appdef.SiteType.forums, title: ls.siteTypeForums, desc: ls.siteTypeForumsDesc },
];
