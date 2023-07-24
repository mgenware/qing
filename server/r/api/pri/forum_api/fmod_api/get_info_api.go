/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fmodapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
)

func getInfoAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	fid := appcm.ContextForumID(r.Context())

	db := appDB.DB()
	res, err := da.Forum.SelectInfoForEditing(db, fid)
	appcm.PanicOn(err, "failed to select forum info")
	return resp.MustComplete(res)
}
