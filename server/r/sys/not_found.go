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

	"qing/a/appHandler"
	"qing/a/handler"
)

// NotFoundGET is a application wide handler for 404 errors.
func NotFoundGET(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	msg := resp.LS().ResNotFound

	// Note that pass `true` as the `expected` param so that template manager won't treat it as a 500 error.
	return appHandler.MainPage().MustError(r, resp.Lang(), errors.New(msg), http.StatusNotFound, w)
}
