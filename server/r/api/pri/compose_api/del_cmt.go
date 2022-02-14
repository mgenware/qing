/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/dax"
	"qing/lib/clib"
)

func delCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := clib.MustGetIDFromDict(params, "id")
	err := dax.DeleteCmt(appDB.DB(), id, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
