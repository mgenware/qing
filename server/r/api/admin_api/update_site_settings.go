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
	"math"
	"net/http"
	"qing/a/app"
	"qing/a/appConf"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/sod/mxSod"
)

// Changes to settings (app config) require a server restart.
func updateSiteSettingsLocked(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	key := clib.MustGetIntFromDict(params, "key")
	// Get settings JSON string.
	stJSON := clib.MustGetStringFromDict(params, "stJSON", math.MaxInt)

	mutex := appConf.DiskMutex()
	mutex.Lock()
	defer mutex.Unlock()

	conf := appConf.DiskConfigUnsafe()

	switch appdef.SiteSettings(key) {
	case appdef.SiteSettingsGen:
		genST := mxSod.SiteGenSettings{}
		err := json.Unmarshal([]byte(stJSON), &genST)
		app.PanicOn(err)

		conf.Site.SiteType = genST.SiteType
	default:
		return resp.MustFail(fmt.Sprintf("unknown settings key \"%v\"", key))
	}

	err := appConf.UpdateDiskConfigUnsafe(conf)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}
