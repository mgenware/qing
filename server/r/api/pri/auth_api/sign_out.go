/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appUserManager"
	"qing/a/handler"
)

func signOut(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	if err != nil {
		return resp.MustFail(err)
	}
	return resp.MustComplete(nil)
}
