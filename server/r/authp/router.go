/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"net/http"
	"qing/a/app"
	"qing/a/appHandler"
	"qing/a/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

const authScript = "auth/authEntry"

func init() {
	Router.Get("/verify-reg-email/{key}", verifyRegEmail)
	Router.Get("/*", genericGET)
}

func genericGET(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	// Page title will be set on frontend side
	d := app.MainPageData("", "")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript(authScript)

	return resp.MustComplete(&d)
}
