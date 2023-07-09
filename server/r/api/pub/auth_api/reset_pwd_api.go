/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authapi

import (
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

// The last step of password recovery, where the user completes the process.
func resetPwdAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic(fmt.Errorf("empty input"))
	}

	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	pwd := clib.MustGetMinMaxStringFromDict(params, "pwd", appDef.LenMinUserPwd, appDef.LenMaxUserPwd)

	uidStr, err := appService.Get().ResetPwdVerifier.Verify(key)
	appcm.PanicOn(err)

	targetUID, err := strconvx.ParseUint64(uidStr)
	appcm.PanicOn(err)

	if targetUID == 0 {
		return resp.MustFail("unexpected 0 UID")
	}

	pwdHash, err := appService.Get().HashingAlg.CreateHash(pwd)
	appcm.PanicOn(err)

	// Update password.
	err = da.UserPwd.UpdateHashByID(appDB.DB(), targetUID, pwdHash)
	appcm.PanicOn(err)

	// TODO: force logout all sessions!
	return resp.MustComplete(nil)
}
