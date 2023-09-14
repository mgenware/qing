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
	"qing/a/appConfig"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/coreConfig"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/sod/adminSod"
)

func getSiteSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	key := clib.MustGetIntFromDict(params, "key")

	needRestart := appConfig.DiskConfigUpdated()
	stBase := adminSod.NewSiteSTBase(needRestart)

	ac := appConfig.Get(r)
	cc := coreConfig.Get()
	sc := cc.Site

	switch appDef.GetSiteSettings(key) {
	case appDef.GetSiteSettingsGeneral:
		coreData := adminSod.NewGetSiteGeneralST(&stBase, sc.URL, string(ac.PostPermission()), sc.Name)
		return resp.MustComplete(coreData)

	case appDef.GetSiteSettingsLangs:
		supportedLangs, err := apicom.GetSiteSupportedLangs()
		appcm.PanicOn(err, "failed to get supported langs")

		currentLangs := sc.Langs
		langSTData := adminSod.NewGetSiteLangsST(&stBase, supportedLangs, currentLangs)
		return resp.MustComplete(langSTData)

	default:
		return resp.MustFail(fmt.Sprintf("Unknown settings key \"%v\"", key))
	}
}
