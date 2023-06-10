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
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"qing/sod/authSod"

	"github.com/mgenware/goutil/jsonx"
)

func findUsers(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()

	byID := jsonx.GetIntOrDefault(params, "byID")
	var err error
	var users []da.DBFindUser
	db := appDB.DB()
	if byID != 0 {
		id := clib.MustGetIDFromDict(params, "value")
		user, err := da.User.FindUserByID(db, id)
		if err == sql.ErrNoRows {
			return resp.MustComplete(nil)
		}
		appcm.PanicOn(err)
		users = []da.DBFindUser{user}
	} else {
		name := clib.MustGetStringFromDict(params, "value", appDef.LenMaxName)
		users, err = da.User.FindUsersByName(db, "%"+name+"%")
		if err == sql.ErrNoRows {
			return resp.MustComplete(nil)
		}
		appcm.PanicOn(err)
	}
	userModels := make([]authSod.User, len(users))
	for i, user := range users {
		userModels[i] = rcom.CreateAuthUser(user.ID, user.Name, user.IconName)
	}
	return resp.MustComplete(userModels)
}
