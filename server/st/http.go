/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package st

import (
	"net/http"
	"net/http/httptest"
	"qing/app/handler"

	"github.com/go-chi/chi"
)

func HTTPGetRecorder(route, url string, h handler.HTMLHandlerFunc) *httptest.ResponseRecorder {
	rt := chi.NewRouter()
	rt.Handle(route, handler.HTMLHandlerToHTTPHandler(h))
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		panic(err)
	}
	rr := httptest.NewRecorder()
	rt.ServeHTTP(rr, req)
	return rr
}
