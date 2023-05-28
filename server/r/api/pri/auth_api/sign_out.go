/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authapi

import (
	"fmt"
	"net/http"
	"qing/a/appHandler"
	"qing/a/appUserManager"
	"qing/a/handler"
)

func signOut(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	if err != nil {
		return resp.MustFail(fmt.Sprintf("Error signing out: %v", err))
	}
	return resp.MustComplete(nil)
}
