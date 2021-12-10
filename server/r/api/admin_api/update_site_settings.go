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
	"qing/app/defs"
	"qing/app/handler"
	"qing/lib/validator"
	"qing/sod/app/appSettingsObj"
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
	diskST, err := appSettings.LoadFromDisk()
	app.PanicIfErr(err)

	// k: settings key, v: settings JSON string.
	for k, v := range settingsDict {
		vString, ok := v.(string)
		if !ok {
			return resp.MustFail(fmt.Errorf("settings value is not a valid string. Key: %v, got: %v", k, v))
		}
		switch k {
		case defs.Shared.KeyCommunitySettings:
			var comST appSettingsObj.CommunitySettings
			err := json.Unmarshal([]byte(vString), &comST)
			app.PanicIfErr(err)
			diskST.Community = comST
			appSettings.SetRestartSettings(appSettings.ForumsRestartSettings)
		default:
			return resp.MustFail(fmt.Errorf("unknown settings key \"%v\"", k))
		}
	}

	err = appSettings.WriteAppSettings(diskST)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
