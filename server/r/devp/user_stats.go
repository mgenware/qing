/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"

	"qing/a/app"
	"qing/a/appDB"
	"qing/a/handler"
	"qing/da"
)

func userPostCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	c, err := da.UserStats.TestSelectPostCount(appDB.DB(), uid)
	app.PanicOn(err)
	return resp.MustComplete(c)
}

func userThreadCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	c, err := da.UserStats.TestSelectFPostCount(appDB.DB(), uid)
	app.PanicOn(err)
	return resp.MustComplete(c)
}
