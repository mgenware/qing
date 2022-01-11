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
	"qing/a/defs"
	"qing/a/handler"
	"qing/app"
	"qing/da"
	"qing/lib/validator"

	"github.com/mgenware/goutil/jsonx"
)

func setInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)

	id := validator.MustGetIDFromDict(params, "id")
	name := validator.MustGetStringFromDict(params, "name", defs.Shared.MaxNameLen)
	desc := jsonx.GetStringOrDefault(params, "desc")

	db := appDB.DB()
	err := da.ForumGroup.UpdateInfo(db, id, name, desc)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
