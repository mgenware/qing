/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authapi

import (
	"database/sql"
	"fmt"
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appUserManager"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func signInAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()

	email := clib.MustGetStringFromDict(params, "email", appDef.LenMaxEmail)
	pwd := clib.MustGetStringFromDict(params, "pwd", appDef.LenMaxUserPwd)

	// Verify user ID.
	uid, err := da.User.SelectIDFromEmail(appDB.DB(), email)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFail(resp.LS().InvalidNameOrPwd)
		}
		return resp.MustFail(fmt.Sprintf("Error selecting ID from email: %v", err))
	}
	if uid == 0 {
		panic(fmt.Errorf("signInPOST: UserID is 0"))
	}

	// Verify password.
	hash, err := da.UserPwd.SelectHashByID(appDB.DB(), uid)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFail(resp.LS().InvalidNameOrPwd)
		}
		return resp.MustFail(fmt.Sprintf("Error selecting hash by ID: %v", err))
	}

	pwdValid, err := appService.Get().HashingAlg.ComparePasswordAndHash(pwd, hash)
	appcm.PanicOn(err, "Error comparing password and hash")

	if !pwdValid {
		return resp.MustFail(resp.LS().InvalidNameOrPwd)
	}

	err = appUserManager.Get().Login(uid, w, r)
	appcm.PanicOn(err, "Error logging in")
	return resp.MustComplete(nil)
}
