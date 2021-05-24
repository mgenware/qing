/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appHandler

import (
	"net/http"
	"qing/app/defs"
	"qing/app/handler"
	"time"
)

// HTMLResponse returns common objects used to compose an HTML response.
func HTMLResponse(w http.ResponseWriter, r *http.Request) *handler.HTMLResponse {
	tm := MainPage()
	resp := handler.NewHTMLResponse(r, tm, w)
	return resp
}

// JSONResponse returns common objects used to compose an HTML response.
func JSONResponse(w http.ResponseWriter, r *http.Request) *handler.JSONResponse {
	resp := handler.NewJSONResponse(r, w)
	return resp
}

// MainPageData wraps a call to MainPageData.
func MainPageData(title, contentHTML string) *handler.MainPageData {
	return handler.NewMainPageData(title, contentHTML)
}

func NewCookie(k, v string) *http.Cookie {
	return &http.Cookie{Name: k, Value: v, Path: "/", Expires: time.Now().Add(time.Second * defs.CookiesExpirySecs)}
}

func DeleteCookie(k string) *http.Cookie {
	c := NewCookie(k, "")
	c.Expires = time.Now().AddDate(-1, -1, -1)
	return c
}
