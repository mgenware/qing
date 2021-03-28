/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func setAdmin(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := app.ContextUserID(r)

	targetUserID := validator.MustGetIDFromDict(params, "target_user_id")
	value := validator.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		return resp.MustFailWithCode(defs.Shared.ErrCannotSetAdminOfYourself)
	}

	db := app.DB
	isAdmin, err := da.User.SelectIsAdmin(db, targetUserID)
	app.PanicIfErr(err)
	if isAdmin {
		return resp.MustFailWithCode(defs.Shared.ErrAlreadyAdmin)
	}

	err = da.User.UnsafeUpdateAdmin(db, targetUserID, value == 1)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
