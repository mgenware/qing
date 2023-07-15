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
	"qing/lib/clib"
)

func setAdmin(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()

	targetUserID := clib.MustGetIDFromDict(params, "target_user_id")
	value := clib.MustGetIntFromDict(params, "value")

	if uid == targetUserID {
		return resp.MustFail(resp.LS().CannotRemoveSelfAdmin)
	}

	db := appDB.DB()
	err := da.User.UnsafeUpdateAdmin(db, targetUserID, value == 1)
	appcm.PanicOn(err, "failed to update admin")
	return resp.MustComplete(nil)
}
