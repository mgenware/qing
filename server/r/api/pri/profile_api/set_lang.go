/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appUserManager"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"

	"github.com/mgenware/goutil/jsonx"
)

func setLang(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	sUser := resp.User()
	uid := resp.UserID()

	// Empty `lang` indicates auto option (let browser decides display lang).
	lang := jsonx.GetStringOrDefault(params, "lang")

	// Update DB.
	err := da.User.UpdateLang(appDB.DB(), uid, lang)
	appcm.PanicOn(err)

	// Update session.
	sid := appcm.ContextSID(r.Context())
	sUser.Lang = lang
	err = appUserManager.Get().UpdateUserSession(sid, sUser)
	appcm.PanicOn(err)

	return resp.MustComplete(nil)
}
