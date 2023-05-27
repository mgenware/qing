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
	"qing/a/appConfig"
	"qing/a/appEnv"
	"qing/a/cfgx"
	"qing/a/coreConfig"
	"qing/a/def/appDef"
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/sod/mxSod"
)

type brSetSiteSettingsResult struct {
	Loaded *cfgx.AppConfig `json:"loaded,omitempty"`
	Disk   *cfgx.AppConfig `json:"disk,omitempty"`
}

// NOTE: Changes to settings (app config) require a server restart.
func setSiteSettingsLocked(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	key := clib.MustGetIntFromDict(params, "key")
	// Get settings JSON string.
	stJSON := []byte(clib.MustGetStringFromDict(params, "stJSON", math.MaxInt))
	IsBR := appEnv.IsBR()

	switch appDef.SetSiteSettings(key) {
	case appDef.SetSiteSettingsPostPermission:
		var postPerm frozenDef.PostPermissionConfig
		err := json.Unmarshal(stJSON, &postPerm)
		app.PanicOn(err)
		if postPerm == "" {
			panic("invalid post permission value")
		}
		appConfig.UpdateDiskConfig(func(diskCfg *cfgx.AppConfig) {
			diskCfg.Permissions.RawPost = string(postPerm)
		})

	case appDef.SetSiteSettingsLangs:
		var langs []string
		err := json.Unmarshal(stJSON, &langs)
		app.PanicOn(err)
		if len(langs) == 0 {
			panic("error updating langs settings: empty array is not allowed")
		}
		coreConfig.UpdateDiskConfig(func(diskCfg *cfgx.CoreConfig) {
			diskCfg.Site.Langs = langs
		})

	case appDef.SetSiteSettingsInfo:
		var infoData mxSod.SetSiteInfoSTData
		err := json.Unmarshal(stJSON, &infoData)
		app.PanicOn(err)
		coreConfig.UpdateDiskConfig(func(diskCfg *cfgx.CoreConfig) {
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
			Loaded: appConfig.Get(r),
			Disk:   appConfig.BRDiskConfig(),
		}
		return resp.MustComplete(result)
	}
	return resp.MustComplete(result)
}
