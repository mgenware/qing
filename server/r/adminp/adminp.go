/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminp

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/appUserManager"
	"qing/a/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

const adminLSKey = "admin"

func init() {
	Router.Core.Use(appUserManager.Get().RequireLoginHTMLMiddleware)
	Router.Get("/*", defaultHandler)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	assm := appHandler.MainPage().AssetManager()
	d.Scripts = assm.MustGetLangScript(resp.Lang(), adminLSKey) + assm.MustGetScript("adminEntry")

	return resp.MustComplete(&d)
}
