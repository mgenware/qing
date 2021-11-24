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
	// Auth router.
	authRouter := handler.NewJSONRouter()
	authRouter.Core.Use(middleware.ParseJSON)

	authRouter.Post("/in", signInHandler)
	authRouter.Post("/new", newUserHandler)
	authRouter.Post("/del", deleteUser)
	authRouter.Post("/info", fetchUserInfo)
	Router.Mount("/auth", authRouter)

	// User router.
	userRouter := handler.NewJSONRouter()
	userRouter.Core.Use(middleware.ParseJSON)

	userRouter.Post("/post-count", userPostCount)
	userRouter.Post("/question-count", userQuestionCount)
	userRouter.Post("/answer-count", userAnswerCount)
	userRouter.Post("/discussion-count", userDiscussionCount)
	Router.Mount("/user", userRouter.Core)

	// Compose router.
	composeRouter := handler.NewJSONRouter()
	composeRouter.Core.Use(middleware.ParseJSON)

	composeRouter.Post("/set-debug-time", setDebugTime)
	Router.Mount("/compose", composeRouter.Core)

	// GET routes are all handled at frontend.
	Router.Get("/*", handler.HTMLHandlerToHTTPHandler(defaultHandler))
}

func defaultHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := appHandler.MainPageData("", "")
	d.Scripts = appHandler.MainPage().ScriptString(devPageScript)

	return resp.MustComplete(d)
}
