/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"
	"qing/a/app"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/a/middleware"
	"qing/r/devp/mails"

	"github.com/go-chi/chi/v5"
)

var Router = chi.NewRouter()

const devPageScript = "devPage/devPageEntry"

func init() {
	// Some auth related routes are GET only. They are used in BR tests.
	authRouter := handler.NewHTMLRouter()
	authRouter.Get("/in/{uid}", signInGETHandler)
	authRouter.Get("/out", signOutGETHandler)
	authRouter.Get("/accVerified", accVerifiedGETHandler)
	authRouter.Get("/*", defaultHandler)

	Router.Mount("/err", errRouter)
	Router.Mount("/auth", authRouter)

	Router.Mount("/api", apiRouter())
	// GET routes are all handled on frontend.
	Router.Get("/*", handler.HTMLHandlerToHTTPHandler(defaultHandler))
}

func apiNotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404 Not Found"))
}

func apiRouter() *handler.JSONRouter {
	r := handler.NewJSONRouter()
	r.Core.Use(middleware.APIMiddleware)

	r.Core.NotFound(apiNotFoundHandler)

	// Auth router.
	authRouter := handler.NewJSONRouter()
	authRouter.Post("/in", signInHandler)
	authRouter.Post("/new", newUserHandler)
	authRouter.Post("/del", deleteUser)
	authRouter.Post("/info", fetchUserInfo)
	authRouter.Post("/cur", currentUser)
	r.Mount("/auth", authRouter)

	// User router.
	userRouter := handler.NewJSONRouter()
	userRouter.Post("/post-count", userPostCount)
	userRouter.Post("/fpost-count", userFPostCount)
	r.Mount("/user", userRouter)

	// Compose router.
	composeRouter := handler.NewJSONRouter()
	composeRouter.Post("/set-debug-time", setDebugTime)
	r.Mount("/compose", composeRouter)

	// Mail router
	r.Mount("/mails", mails.Router)
	return r
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := app.MainPageData("", "")
	d.Scripts = appHandler.MainPage().AssetManager().Script(devPageScript)

	return resp.MustComplete(&d)
}
