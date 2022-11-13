/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package configs

import "qing/a/def/appdef"

type SiteConfig struct {
	Type int `json:"type,omitempty"`
}

func (sc *SiteConfig) SiteType() appdef.SiteType {
	return appdef.SiteType(sc.Type)
}

func (sc *SiteConfig) BlogSite() bool {
	return sc.SiteType() == appdef.SiteTypeBlog
}

func (sc *SiteConfig) CommunitySite() bool {
	return sc.SiteType() == appdef.SiteTypeCommunity
}

func (sc *SiteConfig) ForumSite() bool {
	return sc.SiteType() == appdef.SiteTypeForums
}
