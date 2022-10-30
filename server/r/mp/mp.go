/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mp

import (
	"net/http"
	"qing/a/app"
	"qing/a/appHandler"
	"qing/a/appUserManager"
	"qing/a/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	Router.Core.Use(appUserManager.Get().RequireLoginHTMLMiddleware)
	Router.Get("/*", defaultHandler)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := app.MainPageData("", "")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("m", "mEntry")

	return resp.MustComplete(&d)
}
