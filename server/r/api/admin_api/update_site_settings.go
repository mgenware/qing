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
	stJSON := []byte(clib.MustGetStringFromDict(params, "stJSON", math.MaxInt))

	mutex := appConf.DiskMutex()
	mutex.Lock()
	defer mutex.Unlock()

	c := appConf.DiskConfigUnsafe()

	switch appdef.SetSiteSettings(key) {
	case appdef.SetSiteSettingsInfo:
		genST := mxSod.SiteGeneralST{}
		err := json.Unmarshal(stJSON, &genST)
		app.PanicOn(err)
		if len(genST.Langs) == 0 {
			panic("error updating langs settings: empty array is not allowed")
		}
		c.Site.SiteType = genST.SiteType

	case appdef.SiteSettingsLangs:
		var langs []string
		err := json.Unmarshal(stJSON, &langs)
		app.PanicOn(err)
		c.Site.Langs = langs

	default:
		return resp.MustFail(fmt.Sprintf("unknown settings key \"%v\"", key))
	}

	err := appConf.UpdateDiskConfigUnsafe(c)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}
