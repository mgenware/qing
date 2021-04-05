/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profilep

import (
	"net/http"
	"net/http/httptest"
	"qing/app/handler"
	"testing"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v6/test"
)

func TestGetProfile(t *testing.T) {
	rt := chi.NewRouter()
	rt.Handle("/get-profile/{uid}", handler.HTMLHandlerToHTTPHandler(GetProfile))
	req, err := http.NewRequest("GET", "/get-profile/123", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	rt.ServeHTTP(rr, req)

	test.Assert(t, rr.Code, http.StatusOK)
	test.Assert(t, rr.Body.String(), "lire")
}
