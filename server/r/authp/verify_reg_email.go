/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"fmt"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/handler"
	"qing/da"
	authapi "qing/r/api/pub/auth_api"

	"github.com/go-chi/chi/v5"
)

var vAccVerifiedPage = appHandler.MainPage().MustParseView("auth/accountVerified.html")

type AccVerifiedPageData struct {
	handler.LocalizedTemplateData
}

func verifyRegEmail(w http.ResponseWriter, r *http.Request) handler.HTML {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic(fmt.Errorf("empty input"))
	}

	lang := app.ContextLanguage(r)
	ls := appHandler.MainPage().Dictionary(lang)
	dataString, err := appService.Get().RegEmailVerificator.Verify(key)
	app.PanicOn(err)

	if dataString == "" {
		// Expired
		panic(ls.RegEmailVeriExpired)
	}
	createUserData, err := authapi.StringToCreateUserData(dataString)
	app.PanicOn(err)

	pwdHash, err := appService.Get().HashingAlg.CreateHash(createUserData.Pwd)
	app.PanicOn(err)

	uid, err := da.UserPwd.AddPwdBasedUser(appDB.DB(), createUserData.Email, createUserData.Name, pwdHash)
	app.PanicOn(err)

	userURL := appURL.Get().UserProfile(uid)
	http.Redirect(w, r, userURL, http.StatusFound)
	return handler.HTML(0)
}

func RenderAccountVerified(lang string, w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	ls := appHandler.MainPage().Dictionary(lang)
	d := appHandler.MainPageData(ls.EmailVerified, vAccVerifiedPage.MustExecuteToString(AccVerifiedPageData{}))
	return resp.MustComplete(&d)
}
