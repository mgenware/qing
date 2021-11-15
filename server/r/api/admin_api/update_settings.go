/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func updateSettings(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := app.ContextUserID(r)

	targetUserID := validator.MustGetIDFromDict(params, "target_user_id")
	value := validator.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		return resp.MustFailWithCode(defs.Shared.ErrCannotSetAdminOfYourself)
	}

	db := appDB.DB()
	err := da.User.UnsafeUpdateAdmin(db, targetUserID, value == 1)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
