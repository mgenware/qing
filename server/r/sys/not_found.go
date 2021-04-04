/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package sys

import (
	"errors"
	"net/http"

	"qing/app/appConfig"
	"qing/app/appHandler"
	"qing/app/appLog"
	"qing/app/handler"

	strf "github.com/mgenware/go-string-format"
)

// NotFoundGET is a application wide handler for 404 errors.
func NotFoundGET(w http.ResponseWriter, r *http.Request) handler.HTML {
	// Set 404 status code
	w.WriteHeader(http.StatusNotFound)
	resp := appHandler.HTMLResponse(w, r)
	msg := strf.Format(resp.LocalizedDictionary().PPageNotFound, r.URL.String())

	if appConfig.Get().HTTP.Log404Error {
		appLog.Get().NotFound("http", r.URL.String())
	}

	// Note that pass `true` as the `expected` param so that template manager won't treat it as a 500 error.
	return appHandler.MainPage().MustError(r, resp.Lang(), errors.New(msg), true, w)
}
