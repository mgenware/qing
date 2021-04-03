/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"net/http"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/da"
	"qing/r/rcom"
)

func getAdmins(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	admins, err := da.User.UnsafeSelectAdmins(appDB.Get().DB())
	if err != nil {
		panic(err)
	}
	userModels := make([]rcom.UserInfo, len(admins))
	for i, user := range admins {
		userModels[i] = rcom.NewUserInfo(user.ID, user.Name, user.IconName)
	}
	return resp.MustComplete(userModels)
}
