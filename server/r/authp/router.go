/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"net/http"
	"qing/app/appHandler"
	"qing/app/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	Router.Get("/verify-reg-email/{key}", verifyRegEmail)
	Router.Get("/*", genericGET)
}

func genericGET(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	content := "<auth-app></auth-app>"
	// Page title will be set on frontend side
	d := appHandler.MainPageData("", content)
	d.Scripts = appHandler.MainPage().AssetManager().JS.Auth

	return resp.MustComplete(d)
}
