/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mp

import (
	"net/http"
	"qing/app/appHandler"
	"qing/app/appUserManager"
	"qing/app/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

const mScript = "mEntry"

func init() {
	Router.Core.Use(appUserManager.Get().RequireLoginHTMLMiddleware)
	Router.Get("/*", defaultHandler)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage().ScriptString(mScript)

	return resp.MustComplete(d)
}
