/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package sitest

import (
	"log"
	"qing/a/def/appdef"
	"qing/lib/iolib"

	"github.com/mgenware/goutil/iox"
)

type SiteSettings struct {
	SiteURL  string   `json:"site_url,omitempty"`
	SiteName string   `json:"site_name,omitempty"`
	SiteType int      `json:"site_type,omitempty"`
	Langs    []string `json:"langs,omitempty"`
}

func (sc *SiteSettings) TypedSiteType() appdef.SiteType {
	return appdef.SiteType(sc.SiteType)
}

func (sc *SiteSettings) BlogSite() bool {
	return sc.TypedSiteType() == appdef.SiteTypeBlog
}

func (sc *SiteSettings) CommunitySite() bool {
	return sc.TypedSiteType() == appdef.SiteTypeCommunity
}

func (sc *SiteSettings) ForumSite() bool {
	return sc.TypedSiteType() == appdef.SiteTypeForums
}

func ReadSiteSettings(file string) (*SiteSettings, error) {
	log.Printf("Loading site settings at \"%v\"", file)
	exist, err := iox.FileExists(file)
	if err != nil {
		return nil, err
	}
	if !exist {
		return nil, nil
	}

	var st SiteSettings
	err = iolib.ReadJSONFile(file, &st)
	if err != nil {
		return nil, err
	}
	return &st, nil
}
