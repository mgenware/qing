/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appHandler

import (
	"net/http"
	"qing/a/handler"
)

// HTMLResponse returns common objects used to compose an HTML response.
func HTMLResponse(w http.ResponseWriter, r *http.Request) *handler.HTMLResponse {
	tm := MainPage()
	resp := handler.NewHTMLResponse(r, tm, w)
	return resp
}

// JSONResponse returns common objects used to compose an HTML response.
func JSONResponse(w http.ResponseWriter, r *http.Request) *handler.JSONResponse {
	resp := handler.NewJSONResponse(r, w)
	return resp
}

// MainPageData wraps a call to MainPageData.
func MainPageData(title, contentHTML string) *handler.MainPageData {
	return handler.NewMainPageData(title, contentHTML)
}
