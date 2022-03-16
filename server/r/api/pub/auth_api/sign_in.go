/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authapi

import (
	"database/sql"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appUserManager"
	"qing/a/def"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func signIn(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	email := clib.MustGetStringFromDict(params, "email", def.App.MaxEmailLen)
	pwd := clib.MustGetStringFromDict(params, "pwd", def.App.MaxUserPwdLen)

	// Verify user ID.
	uid, err := da.User.SelectIDFromEmail(appDB.DB(), email)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFailWithCode(def.App.ErrInvalidUserOrPwd)
		}
		return resp.MustFail(err)
	}
	if uid == 0 {
		panic("signInPOST: UserID is 0")
	}

	// Verify password.
	hash, err := da.UserPwd.SelectHashByID(appDB.DB(), uid)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFailWithCode(def.App.ErrInvalidUserOrPwd)
		}
		return resp.MustFail(err)
	}

	pwdValid, err := appService.Get().HashingAlg.ComparePasswordAndHash(pwd, hash)
	if err != nil {
		return resp.MustFail(err)
	}
	if !pwdValid {
		return resp.MustFailWithCode(def.App.ErrInvalidUserOrPwd)
	}

	err = appUserManager.Get().Login(uid, w, r)
	if err != nil {
		panic(err.Error())
	}

	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	return handler.JSON(0)
}
