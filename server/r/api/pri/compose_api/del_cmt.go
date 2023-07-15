/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def/frozenDef"
	"qing/a/handler"
	"qing/da"
	"qing/dax"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

func delCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()

	id := clib.MustGetIDFromDict(params, "id")
	db := appDB.DB()
	hostInfo, err := da.Cmt.SelectHostInfo(db, id)
	appcm.PanicOn(err, "failed to select host info")

	entityType := frozenDef.ContentBaseType(hostInfo.HostType)
	hostTable, err := apicom.GetCmtHostTable(entityType)
	appcm.PanicOn(err, "failed to get host table")

	err = dax.DeleteCmt(db, id, uid, hostTable, hostInfo.HostID)
	appcm.PanicOn(err, "failed to delete comment")
	return resp.MustComplete(nil)
}
