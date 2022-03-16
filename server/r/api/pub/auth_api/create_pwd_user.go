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
	"qing/a/def"
	"qing/a/handler"
	"qing/lib/clib"
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

func createPwdUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	name := clib.MustGetStringFromDict(params, "name", def.App.MaxNameLen)
	email := clib.MustGetStringFromDict(params, "email", def.App.MaxEmailLen)
	pwd := clib.MustGetMinMaxStringFromDict(params, "pwd", def.App.MinUserPwdLen, def.App.MaxUserPwdLen)

	// Put user pwd to memory store and wait for user email verification.
	createUserData := &CreateUserData{
		Email: email,
		Name:  name,
		Pwd:   pwd,
	}
	createUserDataString, err := CreateUserDataToString(createUserData)
	app.PanicIfErr(err)

	publicID, err := appService.Get().RegEmailVerificator.Add(email, createUserDataString)
	if err != nil {
		panic(fmt.Sprintf("RegEmailVerificator.Add failed: %v", err.Error()))
	}
	url := appURL.Get().RegEmailVerification(publicID)

	// TODO: send email.

	// Print URL to console for debugging purposes.
	if app.CoreConfig().DevMode() {
		fmt.Printf("[DEBUG] reg-v-url: %v\n", url)
	}
	return resp.MustComplete(nil)
}
