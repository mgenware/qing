/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/r/rcom"
	"qing/sod/authSod"
)

func admins(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	admins, err := da.User.UnsafeSelectAdmins(appDB.DB())
	appcm.PanicOn(err)
	userModels := make([]authSod.User, len(admins))
	for i, user := range admins {
		userModels[i] = rcom.CreateAuthUser(user.ID, user.Name, user.IconName)
	}
	return resp.MustComplete(userModels)
}
