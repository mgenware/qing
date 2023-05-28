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
	errRouter.Get("/panicErr", panicErrHandler)
	errRouter.Get("/panicObj", panicObjHandler)
	errRouter.Get("/fail", failHandler)
	errRouter.Post("/failAPI", failAPIHandler)
	errRouter.Post("/panicErrAPI", panicErrAPI)
	errRouter.Post("/panicObjAPI", panicObjAPI)
}

func panicErrHandler(w http.ResponseWriter, r *http.Request) {
	panic(errors.New("test error"))
}

func panicObjHandler(w http.ResponseWriter, r *http.Request) {
	panic(-32)
}

func failHandler(w http.ResponseWriter, r *http.Request) {
	resp := appHandler.HTMLResponse(w, r)
	resp.MustFailWithError(errors.New("test error"), http.StatusInternalServerError)
}

func failAPIHandler(w http.ResponseWriter, r *http.Request) {
	resp := appHandler.JSONResponse(w, r)
	resp.MustFail("test error")
}

func panicErrAPI(w http.ResponseWriter, r *http.Request) {
	panic(errors.New("test error"))
}

func panicObjAPI(w http.ResponseWriter, r *http.Request) {
	panic(-32)
}
