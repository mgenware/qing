/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package confs

import (
	"qing/a/def/appdef"
)

type SiteConfig struct {
	URL   string   `json:"url,omitempty"`
	Name  string   `json:"name,omitempty"`
	Type  int      `json:"type,omitempty"`
	Langs []string `json:"langs,omitempty"`
}

func (sc *SiteConfig) TypedSiteType() appdef.SiteType {
	return appdef.SiteType(sc.Type)
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
