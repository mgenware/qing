/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import (
	"qing/sod/app/appSettingsObj"
)

type AppSettings struct {
	raw *appSettingsObj.AppSettings
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

func (st *AppSettings) Raw() appSettingsObj.AppSettings {
	return *st.raw
}

func NewAppSettings(obj *appSettingsObj.AppSettings) *AppSettings {
	return &AppSettings{raw: obj}
}
