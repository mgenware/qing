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
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appcom"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"

	"github.com/mgenware/goutil/jsonx"
)

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	fid := appcom.ContextForumID(r.Context())
	name := validator.MustGetStringFromDict(params, "name", defs.DB.MaxNameLen)
	desc := jsonx.GetStringOrDefault(params, "desc")

	db := appDB.DB()
	err := da.Forum.UpdateInfo(db, fid, name, desc)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
