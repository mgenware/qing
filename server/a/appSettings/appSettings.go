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
	appSod "qing/sod/app"
)

type AppSettings struct {
	raw *appSod.AppRawSettings
}

func (st *AppSettings) CommunityEnabled() bool {
	return st.raw.Community.CommunityEnabled
}

func (st *AppSettings) Forums() bool {
	return st.CommunityEnabled() && st.raw.Community.ForumsEnabled
}

func (st *AppSettings) ForumGroups() bool {
	return st.CommunityEnabled() && st.raw.Community.ForumGroupsEnabled
}

// Used in main page template.
func (st *AppSettings) CommunityMode() appdef.CommunityMode {
	if st.CommunityEnabled() {
		if st.Forums() {
			return appdef.CommunityModeForums
		}
		return appdef.CommunityModeCommunity
	} else {
		return appdef.CommunityModeDisabled
	}
}

func NewAppSettings(obj *appSod.AppRawSettings) *AppSettings {
	if obj == nil {
		panic(errors.New("`obj` cannot be nil"))
	}
	return &AppSettings{raw: obj}
}
