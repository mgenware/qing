/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/app/middleware"

	"github.com/go-chi/chi"
)

var Router = chi.NewRouter()

const devPageScript = "devPage/devPageEntry"

func init() {
	Router.Mount("/api", apiRouter())
	// GET routes are all handled on frontend.
	Router.Get("/*", handler.HTMLHandlerToHTTPHandler(defaultHandler))
}

func apiRouter() *handler.JSONRouter {
	r := handler.NewJSONRouter()
	r.Core.Use(middleware.ParseJSON)

	// Auth router.
	authRouter := handler.NewJSONRouter()
	authRouter.Post("/in", signInHandler)
	authRouter.Post("/new", newUserHandler)
	authRouter.Post("/del", deleteUser)
	authRouter.Post("/info", fetchUserInfo)
	r.Mount("/auth", authRouter)

	// User router.
	userRouter := handler.NewJSONRouter()
	userRouter.Post("/post-count", userPostCount)
	userRouter.Post("/question-count", userQuestionCount)
	userRouter.Post("/answer-count", userAnswerCount)
	userRouter.Post("/discussion-count", userDiscussionCount)
	r.Mount("/user", userRouter)

	// Compose router.
	composeRouter := handler.NewJSONRouter()
	composeRouter.Post("/set-debug-time", setDebugTime)
	r.Mount("/compose", composeRouter)

	return r
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage().ScriptString(devPageScript)

	return resp.MustComplete(d)
}
