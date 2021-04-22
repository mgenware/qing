/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devpagep

import (
	"net/http"
	"qing/app/appHandler"
	"qing/app/handler"

	"github.com/go-chi/chi"
)

var Router = chi.NewRouter()

const devPageScript = "devPageEntry"

func init() {
	// Auth router.
	authRouter := chi.NewRouter()
	authRouter.Get("/in/{uid}", handler.HTMLHandlerToHTTPHandler(signInHandler))
	authRouter.Get("/out", handler.HTMLHandlerToHTTPHandler(signOutHandler))
	authRouter.Post("/new", handler.JSONHandlerToHTTPHandler(newUserHandler))
	// We have to define a fallback handler for each router.
	Router.Mount("/auth", authRouter)

	Router.Get("/*", handler.HTMLHandlerToHTTPHandler(defaultHandler))
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage().ScriptString(devPageScript)

	return resp.MustComplete(d)
}
