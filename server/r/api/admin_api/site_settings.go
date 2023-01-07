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
	"qing/a/appSiteST"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/r/api/apicom"
	"qing/sod/mxSod"
)

func siteSettingsLocked(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	key := clib.MustGetIntFromDict(params, "key")

	mutex := appSiteST.DiskMutex()
	mutex.Lock()
	defer mutex.Unlock()

	needRestart := appSiteST.GetNeedRestart()
	stBase := mxSod.NewSiteSTBase(needRestart)
	sc := appSiteST.DiskConfigUnsafe()

	switch appdef.GetSiteSettings(key) {
	case appdef.GetSiteSettingsGeneral:
		coreData := mxSod.NewGetSiteGeneralST(&stBase, sc.SiteURL, sc.SiteType, sc.SiteName)
		return resp.MustComplete(coreData)

	case appdef.GetSiteSettingsLangs:
		supportedLangs, err := apicom.GetSiteSupportedLangs()
		app.PanicOn(err)

		currentLangs := sc.Langs
		langSTData := mxSod.NewGetSiteLangsST(&stBase, supportedLangs, currentLangs)
		return resp.MustComplete(langSTData)

	default:
		return resp.MustFail(fmt.Sprintf("Unknown settings key \"%v\"", key))
	}
}
