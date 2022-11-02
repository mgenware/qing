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
func (st *AppSettings) Mode() appdef.AppMode {
	return appdef.AppMode(st.raw.Mode)
}

func (st *AppSettings) BlogMode() bool {
	return st.Mode() == appdef.AppModeBlog
}

func (st *AppSettings) CommunityMode() bool {
	return st.Mode() == appdef.AppModeCommunity
}

func (st *AppSettings) ForumMode() bool {
	return st.Mode() == appdef.AppModeForums
}

func NewAppSettings(obj *appSod.AppRawSettings) *AppSettings {
	if obj == nil {
		panic(errors.New("`obj` cannot be nil"))
	}
	return &AppSettings{raw: obj}
}
