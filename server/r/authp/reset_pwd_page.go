/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
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
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"

	"github.com/go-chi/chi/v5"
	"github.com/mgenware/goutil/strconvx"
)

// This is the second step of password recovery, where the user enters new password.
// When this page is loaded, the server will add another entry to memory store
// to give the user
func resetPwdPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic(fmt.Errorf("empty input"))
	}

	lang := appcm.ContextLanguage(r.Context())
	ls := appHandler.MainPage().Dictionary(lang)

	// Don't remove the entry from memory store, because the user may refresh the page.
	// The entry will be removed when the user successfully resets the password.
	uidStr, err := appService.Get().ResetPwdRequestVerifier.Peak(key)
	appcm.PanicOn(err)

	targetUID, err := strconvx.ParseUint64(uidStr)
	appcm.PanicOn(err)

	pwd := clib.MustGetMinMaxStringFromDict(params, "pwd", appDef.LenMinUserPwd, appDef.LenMaxUserPwd)

	pwdHash, err := appService.Get().HashingAlg.CreateHash(createUserData.Pwd)
	appcm.PanicOn(err)

	// Update password.
	err = da.UserPwd.UpdateHashByID(appDB.DB(), uid, pwdHash)

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

}
