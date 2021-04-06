/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func getCmtSource(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	pid := validator.MustGetIDFromDict(params, "id")
	res, err := da.Cmt.SelectCmtSource(appDB.DB(), pid, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(res)
}
