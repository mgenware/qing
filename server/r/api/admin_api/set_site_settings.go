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
	"qing/a/conf"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/sod/mxSod"
)

type brSetSiteSettingsResult struct {
	Loaded *conf.Config `json:"loaded,omitempty"`
	Disk   *conf.Config `json:"disk,omitempty"`
}

// NOTE: Changes to settings (app config) require a server restart.
func setSiteSettingsLocked(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	key := clib.MustGetIntFromDict(params, "key")
	// Get settings JSON string.
	stJSON := []byte(clib.MustGetStringFromDict(params, "stJSON", math.MaxInt))
	IsBR := conf.IsBREnv()

	switch appdef.SetSiteSettings(key) {
	case appdef.SetSiteSettingsPostPermission:
		var postPerm int
		err := json.Unmarshal(stJSON, &postPerm)
		app.PanicOn(err)
		if postPerm <= 0 {
			panic("invalid post permission value")
		}
		appConf.UpdateDiskConfig(func(diskCfg *conf.Config) {
			diskCfg.Permissions.RawPost = postPerm
		})

	case appdef.SetSiteSettingsLangs:
		var langs []string
		err := json.Unmarshal(stJSON, &langs)
		app.PanicOn(err)
		if len(langs) == 0 {
			panic("error updating langs settings: empty array is not allowed")
		}
		appConf.UpdateDiskConfig(func(diskCfg *conf.Config) {
			diskCfg.Site.Langs = langs
		})

	case appdef.SetSiteSettingsInfo:
		var infoData mxSod.SetSiteInfoSTData
		err := json.Unmarshal(stJSON, &infoData)
		app.PanicOn(err)
		appConf.UpdateDiskConfig(func(diskCfg *conf.Config) {
			diskCfg.Site.Name = infoData.SiteName
			diskCfg.Site.URL = infoData.SiteURL
		})

	default:
		return resp.MustFail(fmt.Sprintf("unknown settings key \"%v\"", key))
	}

	var result *brSetSiteSettingsResult
	if IsBR {
		// In BR mode, return the updated config.
		result = &brSetSiteSettingsResult{
			Loaded: appConf.Get(),
			Disk:   appConf.BRDiskConfig(),
		}
		return resp.MustComplete(result)
	}
	return resp.MustComplete(result)
}
