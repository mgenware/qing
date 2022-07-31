/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fmodapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcom"
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	fid := appcom.ContextForumID(r.Context())
	name := clib.MustGetStringFromDict(params, "name", appdef.LenMaxName)
	desc := jsonx.GetString(params, "desc")

	db := appDB.DB()
	err := da.Forum.UpdateInfo(db, fid, name, desc)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}
