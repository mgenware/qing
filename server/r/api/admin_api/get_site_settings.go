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
	"qing/app"
	"qing/app/appHandler"
	"qing/app/appSettings"
	"qing/app/defs"
	"qing/app/handler"
	"qing/lib/validator"
)

type GetSiteSettingsResult struct {
	Settings    interface{} `json:"settings"`
	NeedRestart bool        `json:"need_restart,omitempty"`
}

func getSiteSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	var settings interface{}
	var needRestart bool
	key := validator.MustGetStringFromDict(params, "key", defs.Shared.MaxNameLen)
	switch key {
	case forumsKey:
		settings = appSettings.Get().Forums
		needRestart = appSettings.GetRestartSettings(appSettings.ForumsRestartSettings)
	default:
		return resp.MustFail(fmt.Errorf("Unknown settings key \"%v\"", key))
	}

	res := GetSiteSettingsResult{Settings: settings, NeedRestart: needRestart}
	return resp.MustComplete(res)
}
