/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/coreConfig"
	"qing/a/handler"
	"qing/lib/httplib"
)

func checkRealIP(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	cc := coreConfig.Get()
	c := cc.Security.RateLimit
	readipHeader := ""
	if c != nil {
		readipHeader = c.RealIPHeader
	}

	if readipHeader == "" {
		return resp.MustFail("No real IP header is set")
	}

	realIP, err := httplib.GetRealIP(r, readipHeader)
	if err != nil {
		return resp.MustFail(err.Error())
	}
	return resp.MustComplete(realIP)
}
