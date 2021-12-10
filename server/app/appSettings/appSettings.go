/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import (
	"errors"
	"qing/sod/app/appRawSettings"
)

type AppSettings struct {
	raw *appRawSettings.AppRawSettings
}

func (st *AppSettings) QueAndDis() bool {
	return st.raw.Community.QueAndDis
}

func (st *AppSettings) Forums() bool {
	return st.QueAndDis() && st.raw.Community.Forums
}

func (st *AppSettings) ForumGroups() bool {
	return st.QueAndDis() && st.raw.Community.ForumGroups
}

func NewAppSettings(obj *appRawSettings.AppRawSettings) *AppSettings {
	if obj == nil {
		panic(errors.New("`obj` cannot be nil"))
	}
	return &AppSettings{raw: obj}
}
