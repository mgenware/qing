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
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	authapi "qing/r/api/pub/auth_api"

	"github.com/go-chi/chi/v5"
)

var vAccVerifiedPage = appHandler.MainPage().MustParseLocalizedView("auth/accountVerifiedPage.html")

type AccVerifiedPageData struct {
	handler.LocalizedTemplateData

	VerifiedUID string
}

func verifyRegEmail(w http.ResponseWriter, r *http.Request) handler.HTML {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic(fmt.Errorf("empty input"))
	}

	lang := appcm.ContextLanguage(r.Context())
	ls := appHandler.MainPage().Dictionary(lang)
	dataString, err := appService.Get().RegEmailVerificator.Verify(key)
	appcm.PanicOn(err)

	if dataString == "" {
		// Expired or not found.
		resp := appHandler.HTMLResponse(w, r)
		return resp.MustFailf(ls.RegEmailVeriExpired, http.StatusServiceUnavailable)
	}
	createUserData, err := authapi.StringToCreateUserData(dataString)
	appcm.PanicOn(err)

	pwdHash, err := appService.Get().HashingAlg.CreateHash(createUserData.Pwd)
	appcm.PanicOn(err)

	verifiedUID, err := da.UserPwd.AddPwdBasedUser(appDB.DB(), createUserData.Email, createUserData.Name, lang, pwdHash)
	appcm.PanicOn(err)

	return RenderAccountVerified(lang, clib.EncodeID(verifiedUID), w, r)
}

func RenderAccountVerified(lang, verifiedUID string, w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	ls := appHandler.MainPage().Dictionary(lang)
	d := AccVerifiedPageData{VerifiedUID: verifiedUID}
	pageData := appHandler.MainPageData(ls.EmailVerified, vAccVerifiedPage.MustExecuteToString(lang, &d))
	return resp.MustComplete(&pageData)
}
