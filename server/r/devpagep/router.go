/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package devpagep

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
)

var Router = handler.NewHTMLRouter()

func init() {
	// Auth router.
	authRouter := handler.NewHTMLRouter()
	authRouter.Get("/in/{uid}", signIn)
	authRouter.Get("/out", signOut)
	// We have to define a fallback handler for each router.
	authRouter.Get("/*", defaultHandler)
	Router.Mount("/auth", authRouter)

	Router.Get("/*", defaultHandler)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := app.MainPageData("", "")
	d.Scripts = app.MainPageManager.AssetsManager.JS.DevPage

	return resp.MustComplete(d)
}
