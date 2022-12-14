/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/handler"
	"qing/da"
	"qing/r/api/apicom"
	"qing/sod/profileSod"
)

func lang(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := resp.UserID()

	supportedLangs, err := apicom.GetSiteSupportedLangs()
	app.PanicOn(err)

	userLang, err := da.User.SelectLang(appDB.Get().DB(), uid)
	app.PanicOn(err)

	res := profileSod.NewGetProfileLangResult(userLang, resp.LS().AutoLangOption, supportedLangs)
	return resp.MustComplete(res)
}
