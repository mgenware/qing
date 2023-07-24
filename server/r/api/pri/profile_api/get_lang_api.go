/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/r/api/apicom"
	"qing/sod/profileSod"
)

func langAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := resp.UserID()

	supportedLangs, err := apicom.GetSiteSupportedLangs()
	appcm.PanicOn(err, "failed to get supported langs")

	userLang, err := da.User.SelectLang(appDB.Get().DB(), uid)
	appcm.PanicOn(err, "failed to get user lang")

	res := profileSod.NewGetProfileLangResult(userLang, resp.LS().AutoLangOption, supportedLangs)
	return resp.MustComplete(res)
}
