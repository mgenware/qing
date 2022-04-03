/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import (
	"errors"
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

func NewAppSettings(obj *appSod.AppRawSettings) *AppSettings {
	if obj == nil {
		panic(errors.New("`obj` cannot be nil"))
	}
	return &AppSettings{raw: obj}
}
