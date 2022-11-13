/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"fmt"
	"net/http"
	"qing/a/app"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/lib/clib"
)

type GetSiteSettingsResult struct {
	Settings    any  `json:"settings"`
	NeedRestart bool `json:"need_restart,omitempty"`
}

func siteSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	diskSettings, err := appSettings.LoadFromDisk()
	app.PanicOn(err)
	var settings any
	var needRestart bool
	key := clib.MustGetStringFromDict(params, "key", appdef.LenMaxName)
	switch key {
	case appdef.KeyCommunitySettings:
		settings = diskSettings.Community
		needRestart = appSettings.GetRestartSettings(appSettings.ForumsRestartSettings)
	default:
		return resp.MustFail(fmt.Sprintf("Unknown settings key \"%v\"", key))
	}

	res := GetSiteSettingsResult{Settings: settings, NeedRestart: needRestart}
	return resp.MustComplete(res)
}
