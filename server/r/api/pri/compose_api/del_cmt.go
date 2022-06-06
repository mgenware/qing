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
	"qing/a/def/appdef"
	"qing/a/handler"
	"qing/da"
	"qing/dax"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

func delCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := clib.MustGetIDFromDict(params, "id")
	db := appDB.DB()
	hostInfo, err := da.Cmt.SelectHostInfo(db, id)
	app.PanicIfErr(err)

	entityType := appdef.ContentBaseType(hostInfo.HostType)
	hostTable, err := apicom.GetCmtHostTable(entityType)
	app.PanicIfErr(err)

	err = dax.DeleteCmt(db, id, uid, hostTable, hostInfo.HostID)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
