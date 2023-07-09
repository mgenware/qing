/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/a/middleware"
	"qing/r/devp/mail"

	"github.com/go-chi/chi/v5"
)

var Router = chi.NewRouter()

func init() {
	// Some auth related routes are GET only. They are used in BR tests.
	authRouter := handler.NewHTMLRouter()
	authRouter.Get("/in/{uid}", signInPage)
	authRouter.Get("/out", signOutPage)
	authRouter.Get("/*", defaultPage)

	Router.Mount("/err", errRouter)
	Router.Mount("/auth", authRouter)

	Router.Mount("/api", apiRouter())
	// GET routes are all handled on frontend.
	Router.Get("/*", handler.HTMLHandlerToHTTPHandler(defaultPage))
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
	authRouter.Post("/in", signInAPI)
	authRouter.Post("/new", newUserAPI)
	authRouter.Post("/del", deleteUserAPI)
	authRouter.Post("/info", fetchUserInfoAPI)
	authRouter.Post("/cur", currentUserAPI)
	authRouter.Post("/get-email", userEmailAPI)
	r.Mount("/auth", authRouter)

	// User router.
	userRouter := handler.NewJSONRouter()
	userRouter.Post("/post-count", userPostCount)
	userRouter.Post("/fpost-count", userFPostCount)
	r.Mount("/user", userRouter)

	// Compose router.
	composeRouter := handler.NewJSONRouter()
	composeRouter.Post("/delete-posts-by-pattern", deletePostsByPattern)
	r.Mount("/compose", composeRouter)

	// Mail router.
	r.Mount("/mail", mail.Router)

	// Misc router.
	miscRouter := handler.NewJSONRouter()
	miscRouter.Post("/real-ip", checkRealIP)
	r.Mount("/misc", miscRouter)
	return r
}

func defaultPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage().AssetManager().MustGetScript("devPageEntry")

	return resp.MustComplete(&d)
}
