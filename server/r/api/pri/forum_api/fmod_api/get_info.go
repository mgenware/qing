/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fmodapi

import (
	"net/http"
	"qing/app"
	"qing/app/appcom"
	"qing/app/handler"
	"qing/da"
)

func getInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	fid := appcom.ContextForumID(r.Context())

	db := app.DB
	res, err := da.Forum.SelectInfoForEditing(db, fid)
	app.PanicIfErr(err)
	return resp.MustComplete(res)
}
