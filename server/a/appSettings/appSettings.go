/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import (
	"errors"
	"qing/a/def/appdef"
	"qing/sod/appSod"
)

type AppSettings struct {
	raw *appSod.AppRawSettings
}

// Used in main page template.
func (st *AppSettings) SiteType() appdef.SiteType {
	return appdef.SiteType(st.raw.Mode)
}

func (st *AppSettings) BlogSite() bool {
	return st.SiteType() == appdef.SiteTypeBlog
}

func (st *AppSettings) CommunitySite() bool {
	return st.SiteType() == appdef.SiteTypeCommunity
}

func (st *AppSettings) ForumSite() bool {
	return st.SiteType() == appdef.SiteTypeForums
}

func NewAppSettings(obj *appSod.AppRawSettings) *AppSettings {
	if obj == nil {
		panic(errors.New("`obj` cannot be nil"))
	}
	return &AppSettings{raw: obj}
}
