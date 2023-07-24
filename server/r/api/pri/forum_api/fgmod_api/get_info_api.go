/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
)

func getInfoAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()

	id := clib.MustGetIDFromDict(params, "id")

	db := appDB.DB()
	res, err := da.ForumGroup.SelectInfoForEditing(db, id)
	appcm.PanicOn(err, "failed to select forum group info")
	return resp.MustComplete(res)
}
