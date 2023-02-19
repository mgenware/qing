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
	"qing/a/appSiteST"
	"qing/a/conf"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/a/sitest"
	"qing/lib/clib"
	"qing/sod/mxSod"
)

type brSetSiteSettingsResult struct {
	Loaded *sitest.SiteSettings `json:"loaded,omitempty"`
	Disk   *sitest.SiteSettings `json:"disk,omitempty"`
}

// NOTE: Changes to settings (app config) require a server restart.
func setSiteSettingsLocked(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	key := clib.MustGetIntFromDict(params, "key")
	// Get settings JSON string.
	stJSON := []byte(clib.MustGetStringFromDict(params, "stJSON", math.MaxInt))
	IsBR := conf.IsBREnv()

	mutex := appSiteST.DiskMutex()
	mutex.Lock()
	defer mutex.Unlock()

	diskConf := appSiteST.DiskConfigUnsafe()
	// We don't update disk config in UT.
	if IsBR {
		copied, err := appSiteST.DeepCopyConfig(diskConf)
		app.PanicOn(err)
		diskConf = copied
	}

	switch appdef.SetSiteSettings(key) {
	case appdef.SetSiteSettingsSiteType:
		var siteType int
		err := json.Unmarshal(stJSON, &siteType)
		app.PanicOn(err)
		if siteType <= 0 {
			panic("invalid site type value")
		}
		diskConf.SiteType = siteType

	case appdef.SetSiteSettingsLangs:
		var langs []string
		err := json.Unmarshal(stJSON, &langs)
		app.PanicOn(err)
		if len(langs) == 0 {
			panic("error updating langs settings: empty array is not allowed")
		}
		diskConf.Langs = langs

	case appdef.SetSiteSettingsInfo:
		var infoData mxSod.SetSiteInfoSTData
		err := json.Unmarshal(stJSON, &infoData)
		app.PanicOn(err)
		diskConf.SiteName = infoData.SiteName
		diskConf.SiteURL = infoData.SiteURL

	default:
		return resp.MustFail(fmt.Sprintf("unknown settings key \"%v\"", key))
	}

	var result *brSetSiteSettingsResult
	if IsBR {
		// In BR mode, return the updated config.
		result = &brSetSiteSettingsResult{
			Loaded: appSiteST.Get(),
			Disk:   diskConf,
		}
	} else {
		err := appSiteST.UpdateDiskConfigUnsafe(diskConf)
		app.PanicOn(err)
		result = nil
	}
	return resp.MustComplete(result)
}
