/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package configs

import "qing/a/def/appdef"

type SiteConfig struct {
	SiteURL  string   `json:"site_url,omitempty"`
	SiteType int      `json:"site_type,omitempty"`
	Langs    []string `json:"langs,omitempty"`
}

func (sc *SiteConfig) TypedSiteType() appdef.SiteType {
	return appdef.SiteType(sc.SiteType)
}

func (sc *SiteConfig) BlogSite() bool {
	return sc.TypedSiteType() == appdef.SiteTypeBlog
}

func (sc *SiteConfig) CommunitySite() bool {
	return sc.TypedSiteType() == appdef.SiteTypeCommunity
}

func (sc *SiteConfig) ForumSite() bool {
	return sc.TypedSiteType() == appdef.SiteTypeForums
}
