/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"errors"
	"net/http"
	"qing/a/appHandler"

	"github.com/go-chi/chi/v5"
)

var errRouter = chi.NewRouter()

func init() {
	errRouter.Get("/panicServer", panicServerHandler)
	errRouter.Get("/panicUser", panicUserHandler)
	errRouter.Get("/failServer", failServerHandler)
	errRouter.Get("/failUser", failUserHandler)
	errRouter.Post("/panicServerAPI", panicServerAPI)
	errRouter.Post("/panicUserAPI", panicUserAPI)
}

func panicServerHandler(w http.ResponseWriter, r *http.Request) {
	panic(errors.New("test error"))
}

func panicUserHandler(w http.ResponseWriter, r *http.Request) {
	panic("Test error")
}

func failServerHandler(w http.ResponseWriter, r *http.Request) {
	resp := appHandler.HTMLResponse(w, r)
	resp.MustFailWithError(errors.New("test error"), false)
}

func failUserHandler(w http.ResponseWriter, r *http.Request) {
	resp := appHandler.HTMLResponse(w, r)
	resp.MustFailWithError(errors.New("test error"), true)
}

func panicServerAPI(w http.ResponseWriter, r *http.Request) {
	panic(errors.New("test error"))
}

func panicUserAPI(w http.ResponseWriter, r *http.Request) {
	panic("Test error")
}
