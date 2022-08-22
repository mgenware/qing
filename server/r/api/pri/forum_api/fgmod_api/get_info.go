/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func getInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	id := clib.MustGetIDFromDict(params, "id")

	db := appDB.DB()
	res, err := da.ForumGroup.SelectInfoForEditing(db, id)
	app.PanicOn(err)
	return resp.MustComplete(res)
}
