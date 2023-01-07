/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSiteST

import (
	"qing/a/def/infdef"
	"qing/a/sitest"
)

var siteST *sitest.SiteSettings

func init() {
	st, err := sitest.ReadSiteSettings(infdef.SiteSettingsFile)
	if err != nil {
		panic(err)
	}
	siteST = st
}

func Get() *sitest.SiteSettings {
	return siteST
}
