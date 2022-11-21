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
	"qing/a/appConf"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/sod/mxSod"
)

func siteSettingsLocked(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	key := clib.MustGetIntFromDict(params, "key")

	mutex := appConf.DiskMutex()
	mutex.Lock()
	defer mutex.Unlock()

	needRestart := appConf.GetNeedRestart()
	stBase := mxSod.NewSiteSettingsBase(needRestart)
	c := appConf.DiskConfigUnsafe()
	sc := c.Site

	switch appdef.SiteSettings(key) {
	case appdef.SiteSettingsGen:
		coreData := mxSod.NewSiteGenSettings(&stBase, sc.SiteType)
		return resp.MustComplete(coreData)
	default:
		return resp.MustFail(fmt.Sprintf("Unknown settings key \"%v\"", key))
	}
}
