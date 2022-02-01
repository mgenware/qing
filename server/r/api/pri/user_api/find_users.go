/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package userapi

import (
	"database/sql"
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/defs"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"

	"github.com/mgenware/goutil/jsonx"
)

func findUsers(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	byID := jsonx.GetIntOrDefault(params, "byID")
	var err error
	var users []da.FindUserResult
	db := appDB.DB()
	if byID != 0 {
		id := clib.MustGetIDFromDict(params, "value")
		user, err := da.User.FindUserByID(db, id)
		if err == sql.ErrNoRows {
			return resp.MustComplete(nil)
		}
		app.PanicIfErr(err)
		users = []da.FindUserResult{user}
	} else {
		name := clib.MustGetStringFromDict(params, "value", defs.Shared.MaxNameLen)
		users, err = da.User.FindUsersByName(db, "%"+name+"%")
		if err == sql.ErrNoRows {
			return resp.MustComplete(nil)
		}
		app.PanicIfErr(err)
	}
	userModels := make([]rcom.UserInfo, len(users))
	for i, user := range users {
		userModels[i] = rcom.NewUserInfo(user.ID, user.Name, user.IconName)
	}
	return resp.MustComplete(userModels)
}
