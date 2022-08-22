/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package app

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/handler"
)

// Helper function to create an HTML response.
func HTMLResponse(w http.ResponseWriter, r *http.Request) handler.HTMLResponse {
	tm := appHandler.MainPage()
	resp := handler.NewHTMLResponse(w, r, tm)
	return resp
}

// Helper function to create a JSON response.
func JSONResponse(w http.ResponseWriter, r *http.Request) handler.JSONResponse {
	resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
	return resp
}

// Helper function to create a MainPageData.
func MainPageData(title, contentHTML string) handler.MainPageData {
	return handler.NewMainPageData(title, contentHTML)
}
