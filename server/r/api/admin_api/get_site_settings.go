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
	"qing/a/app"
	"qing/a/appConfig"
	"qing/a/coreConfig"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/sod/mxSod"
)

func getSiteSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	key := clib.MustGetIntFromDict(params, "key")

	needRestart := appConfig.DiskConfigUpdated()
	stBase := mxSod.NewSiteSTBase(needRestart)

	ac := appConfig.Get(r)
	cc := coreConfig.Get()
	sc := cc.Site
	pc := ac.Permissions

	switch appDef.GetSiteSettings(key) {
	case appDef.GetSiteSettingsGeneral:
		coreData := mxSod.NewGetSiteGeneralST(&stBase, sc.URL, pc.RawPost, sc.Name)
		return resp.MustComplete(coreData)

	case appDef.GetSiteSettingsLangs:
		supportedLangs, err := apicom.GetSiteSupportedLangs()
		app.PanicOn(err)

		currentLangs := sc.Langs
		langSTData := mxSod.NewGetSiteLangsST(&stBase, supportedLangs, currentLangs)
		return resp.MustComplete(langSTData)

	default:
		return resp.MustFail(fmt.Sprintf("Unknown settings key \"%v\"", key))
	}
}
