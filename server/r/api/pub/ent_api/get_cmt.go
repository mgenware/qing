/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package entapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

func getCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := resp.Params()
	uid := resp.UserID()

	id := clib.MustGetIDFromDict(params, "id")

	db := appDB.DB()
	var cmtDB da.CmtResult
	var err error
	if uid > 0 {
		cmtDB, err = da.Cmt.SelectCmtUserMode(db, uid, id)
	} else {
		cmtDB, err = da.Cmt.SelectCmt(db, id)
	}
	appcm.PanicOn(err)

	cmt := apicom.NewCmt(&cmtDB)
	return resp.MustComplete(cmt)
}
