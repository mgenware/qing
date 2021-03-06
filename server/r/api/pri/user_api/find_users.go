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
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"

	"github.com/mgenware/go-packagex/v6/jsonx"
)

func findUsers(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	byID := jsonx.GetIntOrDefault(params, "byID")
	var err error
	var users []da.FindUserResult
	db := appDB.DB()
	if byID != 0 {
		id := validator.MustGetIDFromDict(params, "value")
		user, err := da.User.FindUserByID(db, id)
		if err == sql.ErrNoRows {
			return resp.MustComplete(nil)
		}
		app.PanicIfErr(err)
		users = []da.FindUserResult{user}
	} else {
		name := validator.MustGetStringFromDict(params, "value", defs.DB.MaxNameLen)
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
