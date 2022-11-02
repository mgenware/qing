/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/handler"
)

func updateSiteSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	// TODO: Reactive this when we have more settings.
	// params := app.ContextDict(r)

	// // A note on update app settings. Go doesn't guarantee atomic read/write on primitive data types.
	// // We don't want to add any performance penalty to achieve that since some settings like forums mode
	// // are accessed quite frequently. So we require a server restart on a app settings change.
	// // This API will first deep clone the current app settings, and save the modified cloned settings
	// // into the disk.

	// settingsDict := clib.MustGetDictFromDict(params, "settings")
	// diskST, err := appSettings.LoadFromDisk()
	// app.PanicOn(err)

	// // k: settings key, v: settings JSON string.
	// for k, v := range settingsDict {
	// 	vString, ok := v.(string)
	// 	if !ok {
	// 		return resp.MustFail(fmt.Sprintf("Settings value is not a valid string. Key: %v, got: %v", k, v))
	// 	}
	// 	switch k {
	// 	case appdef.KeyCommunitySettings:
	// 		var comST appSod.CommunityRawSettings
	// 		err := json.Unmarshal([]byte(vString), &comST)
	// 		app.PanicOn(err)
	// 		diskST.Community = comST
	// 		appSettings.SetRestartSettings(appSettings.ForumsRestartSettings)
	// 	default:
	// 		return resp.MustFail(fmt.Sprintf("Unknown settings key \"%v\"", k))
	// 	}
	// }

	// err = appSettings.WriteAppSettings(diskST)
	// app.PanicOn(err)
	return resp.MustComplete(nil)
}
