/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appService"
	"qing/app/appURL"
	"qing/app/handler"
	"qing/da"
	authapi "qing/r/api/pub/auth_api"

	"github.com/go-chi/chi"
)

func verifyRegEmail(w http.ResponseWriter, r *http.Request) handler.HTML {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic("Empty input")
	}

	lang := app.ContextLanguage(r)
	dataString, err := appService.Get().RegEmailVerificator.Verify(key)
	if err != nil {
		panic(err.Error())
	}
	if dataString == "" {
		// Expired
		panic(appHandler.MainPage().Dictionary(lang).RegEmailVeriExpired)
	}
	createUserData, err := authapi.StringToCreateUserData(dataString)
	app.PanicIfErr(err)

	pwdHash, err := appService.Get().HashingAlg.CreateHash(createUserData.Pwd)
	app.PanicIfErr(err)

	uid, err := da.UserPwd.AddPwdBasedUser(appDB.DB(), createUserData.Email, createUserData.Name, pwdHash)
	app.PanicIfErr(err)

	userURL := appURL.Get().UserProfile(uid)
	http.Redirect(w, r, userURL, 302)
	return handler.HTML(0)
}
