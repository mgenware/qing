/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/def"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func setAdmin(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := app.ContextUserID(r)

	targetUserID := clib.MustGetIDFromDict(params, "target_user_id")
	value := clib.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		return resp.MustFailWithCode(def.App.ErrCannotSetAdminOfYourself)
	}

	db := appDB.DB()
	err := da.User.UnsafeUpdateAdmin(db, targetUserID, value == 1)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
