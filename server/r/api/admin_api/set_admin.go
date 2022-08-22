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
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func setAdmin(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := app.ContextUserID(r)

	targetUserID := clib.MustGetIDFromDict(params, "target_user_id")
	value := clib.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		return resp.MustFailWithMsg(resp.LS().CannotRemoveSelfAdmin)
	}

	db := appDB.DB()
	err := da.User.UnsafeUpdateAdmin(db, targetUserID, value == 1)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}
