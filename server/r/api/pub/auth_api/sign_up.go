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
	"qing/a/app"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appURL"
	"qing/a/appcom"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/lib/clib"
)

// CreateUserData contains the information stored in memory store during user email verification.
type CreateUserData struct {
	Email string
	Name  string
	Pwd   string
}

type EmailVerificationData struct {
	MainText string
	Link     string
}

var vEmailVeriView = appHandler.EmailPage().MustParseView("emailVerification.html")

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

func signUp(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	name := clib.MustGetStringFromDict(params, "name", appdef.LenMaxName)
	email := clib.MustGetStringFromDict(params, "email", appdef.LenMaxEmail)
	pwd := clib.MustGetMinMaxStringFromDict(params, "pwd", appdef.LenMinUserPwd, appdef.LenMaxUserPwd)

	// Put user pwd to memory store and wait for user email verification.
	createUserData := CreateUserData{
		Email: email,
		Name:  name,
		Pwd:   pwd,
	}
	createUserDataString, err := CreateUserDataToString(&createUserData)
	app.PanicOn(err)

	publicID, err := appService.Get().RegEmailVerificator.Add(email, createUserDataString)
	if err != nil {
		panic(fmt.Errorf("error: RegEmailVerificator.Add failed: %v", err.Error()))
	}

	ctx := r.Context()
	lang := appcom.ContextLanguage(ctx)
	ls := appHandler.EmailPage().Dictionary(lang)
	url := appURL.Get().RegEmailVerification(ls.QingSiteLink, publicID)

	d := EmailVerificationData{
		MainText: ls.ClickBelowToCompleteReg,
		Link:     url,
	}
	contentHTML := vEmailVeriView.MustExecuteToString(d)

	pageData := handler.NewEmailPageData(ls.VerifyYourEmailTitle, ls.ClickBelowToCompleteReg, contentHTML)
	pageHTML, pageTitle := appHandler.EmailPage().MustComplete(lang, &pageData)

	_, err = appService.Get().Mail.Send(email, pageTitle, pageHTML)
	app.PanicOn(err)

	return resp.MustComplete(nil)
}
