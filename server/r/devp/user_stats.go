/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"

	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
)

func userPostCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	c, err := da.UserStats.TestSelectPostCount(appDB.DB(), uid)
	appcm.PanicOn(err)
	return resp.MustComplete(c)
}

func userFPostCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	c, err := da.UserStats.TestSelectFPostCount(appDB.DB(), uid)
	appcm.PanicOn(err)
	return resp.MustComplete(c)
}
