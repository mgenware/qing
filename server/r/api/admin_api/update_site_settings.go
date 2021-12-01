/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/appHandler"
	"qing/app/appSettings"
	"qing/app/handler"
	"qing/lib/validator"
)

const (
	forumsKey = "forums"
)

func updateSiteSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	// A note on update app settings. Go doesn't guarantee atomic read/write on primitive data types.
	// We don't want to add any performance penalty to achieve that since some settings like forums mode
	// are accessed quite frequently. So we require a server restart on a app settings change.
	// This API will first deep clone the current app settings, and save the modified cloned settings
	// into the disk.

	settingsDict := validator.MustGetDictFromDict(params, "settings")
	copy, err := appSettings.Get().DeepClone()
	app.PanicIfErr(err)

	for k, _ := range settingsDict {
		switch k {
		case forumsKey:
			var forumsSettings *appSettings.ForumsSettings
			err := json.Unmarshal([]byte(validator.MustGetTextFromDict(settingsDict, forumsKey)), &forumsSettings)
			app.PanicIfErr(err)
			copy.Forums = forumsSettings
			appSettings.SetRestartSettings(appSettings.ForumsRestartSettings)
		default:
			return resp.MustFail(fmt.Errorf("Unknown settings key \"%v\"", k))
		}
	}

	err = appSettings.WriteAppSettings(copy)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
