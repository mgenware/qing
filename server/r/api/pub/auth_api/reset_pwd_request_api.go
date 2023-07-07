/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"database/sql"
	"fmt"
	"net/http"
	"qing/a/appConfig"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/appcm"
	"qing/a/coreConfig"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/cview"
)

// The first step of password recovery, where the user send an email to the server.
// The server will send an email to the user with a link to the second step.
func resetPwdRequestAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	// ----- Do rate limiting first -----
	ok, err := appService.Get().RateLmt.RequestIPBasedActivity(r)
	appcm.PanicOn(err)
	if !ok {
		return resp.MustFail(resp.LS().RateLimitExceededErr)
	}
	// ----- End of rate limiting -----

	params := resp.Params()
	ac := appConfig.Get(r)
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxEmail)

	// Verify user ID.
	uid, err := da.User.SelectIDFromEmail(appDB.DB(), email)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFail(resp.LS().InvalidNameOrPwd)
		}
		return resp.MustFail(fmt.Sprintf("Error selecting ID from email: %v", err))
	}
	if uid == 0 {
		panic(fmt.Errorf("resetPwd: UserID is 0"))
	}

	publicID, err := appService.Get().ResetPwdRequestVerifier.Add(email, fmt.Sprint(uid))
	if err != nil {
		panic(fmt.Errorf("error: ResetPwdStep1Verifier.Add failed: %v", err.Error()))
	}

	ctx := r.Context()
	lang := appcm.ContextLanguage(ctx)
	ls := appHandler.EmailPage().Dictionary(lang)
	url := appURL.Get().VerifyRegEmail(ls.QingSiteLink, publicID)
	linkPageData := cview.EmailCommonLinkData{
		MainText: resp.LS().ClickBelowToResetPwd,
		Link:     url,
	}
	contentHTML := cview.RenderEmailCommonLink(&linkPageData)

	pageData := handler.NewEmailPageData(ls.ResetPwdEmailTitle, ls.ClickBelowToResetPwd, contentHTML)
	pageHTML, pageTitle := appHandler.EmailPage().MustComplete(lang, &pageData)

	devCfg := coreConfig.Get().Dev
	noDevMail := false
	if devCfg != nil {
		noDevMail = devCfg.NoDevMail
	}
	err = appService.Get().Mail.SendMail(ac, email, pageTitle, pageHTML, noDevMail, ls.QingSiteName)
	appcm.PanicOn(err)

	return resp.MustComplete(nil)
}
