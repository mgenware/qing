/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/lib/validator"

	"github.com/mgenware/go-packagex/v6/jsonx"
)

func deleteCmt(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "id")
	hostType := validator.MustGetIntFromDict(params, "hostType")
	isReply := jsonx.GetIntOrDefault(params, "isReply")

	cmtTA, err := getCmtTA(hostType)
	app.PanicIfErr(err)
	if isReply == 0 {
		err = cmtTA.DeleteCmt(appDB.DB(), id, uid)
	} else {
		err = cmtTA.DeleteReply(appDB.DB(), id, uid)
	}
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
