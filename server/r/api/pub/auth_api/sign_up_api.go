/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"qing/a/appConfig"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/appcm"
	"qing/a/coreConfig"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/lib/clib"
	"qing/r/cview"
)

// CreateUserData contains the information stored in memory store during user email verification.
type CreateUserData struct {
	Email string
	Name  string
	Pwd   string
}

// CreateUserDataToString serializes a CreateUserData to string.
func CreateUserDataToString(d *CreateUserData) (string, error) {
	bytes, err := json.Marshal(d)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// StringToCreateUserData deserializes a string to CreateUserData.
func StringToCreateUserData(str string) (*CreateUserData, error) {
	var d CreateUserData
	err := json.Unmarshal([]byte(str), &d)
	if err != nil {
		return nil, err
	}
	return &d, nil
}

func signUpAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
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
	name := clib.MustGetStringFromDict(params, "name", appDef.LenMaxName)
	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxEmail)
	pwd := clib.MustGetMinMaxStringFromDict(params, "pwd", appDef.LenMinUserPwd, appDef.LenMaxUserPwd)

	// Put user pwd to memory store and wait for user email verification.
	createUserData := CreateUserData{
		Email: email,
		Name:  name,
		Pwd:   pwd,
	}
	createUserDataString, err := CreateUserDataToString(&createUserData)
	appcm.PanicOn(err)

	publicID, err := appService.Get().RegEmailVerifier.Set(email, createUserDataString)
	if err != nil {
		panic(fmt.Errorf("error: RegEmailVerifier.Add failed: %v", err.Error()))
	}

	ctx := r.Context()
	lang := appcm.ContextLanguage(ctx)
	ls := appHandler.EmailPage().Dictionary(lang)
	url := appURL.Get().VerifyRegEmail(ls.QingSiteLink, publicID)

	linkPageData := cview.EmailCommonLinkData{
		MainText: ls.ClickBelowToCompleteReg,
		Link:     url,
	}
	contentHTML := cview.RenderEmailCommonLink(&linkPageData)

	pageData := handler.NewEmailPageData(ls.VerifyYourEmailTitle, ls.ClickBelowToCompleteReg, contentHTML)
	pageHTML, pageTitle := appHandler.EmailPage().MustComplete(lang, &pageData)

	devCfg := coreConfig.Get().Dev
	realMail := false
	if devCfg != nil {
		realMail = devCfg.RealMail
	}
	err = appService.Get().Mail.SendMail(ac, email, pageTitle, pageHTML, realMail, ls.QingSiteName)
	appcm.PanicOn(err)

	return resp.MustComplete(nil)
}
