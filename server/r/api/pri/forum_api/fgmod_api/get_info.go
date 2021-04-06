/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func getInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	id := validator.MustGetIDFromDict(params, "id")

	db := appDB.DB()
	res, err := da.ForumGroup.SelectInfoForEditing(db, id)
	app.PanicIfErr(err)
	return resp.MustComplete(res)
}
