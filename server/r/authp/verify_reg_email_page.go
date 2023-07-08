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
	"qing/a/appEnv"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	authapi "qing/r/api/pub/auth_api"

	"github.com/go-chi/chi/v5"
)

type AccVerifiedPageData struct {
	handler.LocalizedTemplateData

	VerifiedUID string
}

func verifyRegEmailPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic(fmt.Errorf("empty input"))
	}

	lang := appcm.ContextLanguage(r.Context())
	ls := appHandler.MainPage().Dictionary(lang)
	dataString, err := appService.Get().RegEmailVerifier.Verify(key)
	appcm.PanicOn(err)

	if dataString == "" {
		// Expired or not found.
		resp := appHandler.HTMLResponse(w, r)
		return resp.MustFailf(ls.LinkExpired, http.StatusServiceUnavailable)
	}
	createUserData, err := authapi.StringToCreateUserData(dataString)
	appcm.PanicOn(err)

	pwdHash, err := appService.Get().HashingAlg.CreateHash(createUserData.Pwd)
	appcm.PanicOn(err)

	newUID, err := da.UserPwd.AddPwdBasedUser(appDB.DB(), createUserData.Email, createUserData.Name, lang, pwdHash)
	appcm.PanicOn(err)

	brScripts := ""
	if appEnv.IsBR() {
		newUIDString := clib.EncodeID(newUID)
		brScripts = fmt.Sprintf("__brVerifiedUID_%v__", newUIDString)
	}

	return defaultPageCore(w, r, brScripts)
}
