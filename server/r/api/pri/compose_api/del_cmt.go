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
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/da"
	"qing/dax"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

func delCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := clib.MustGetIDFromDict(params, "id")
	db := appDB.DB()
	hostInfo, err := da.Cmt.SelectHostInfo(db, id)
	app.PanicOn(err)

	entityType := frozenDef.ContentBaseType(hostInfo.HostType)
	hostTable, err := apicom.GetCmtHostTable(entityType)
	app.PanicOn(err)

	err = dax.DeleteCmt(db, id, uid, hostTable, hostInfo.HostID)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}
