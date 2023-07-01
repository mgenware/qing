/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package httplib

import (
	"net/http"
	"net/url"
	"qing/a/def"
	"time"
)

func NewCookie(k, v string, httpOnly, secure bool) *http.Cookie {
	return &http.Cookie{
		Name:     url.QueryEscape(k),
		Value:    url.QueryEscape(v),
		Path:     "/",
		Expires:  time.Now().Add(def.CookiesDefaultExpiry),
		HttpOnly: httpOnly,
		SameSite: http.SameSiteStrictMode}
}

func DeleteCookie(k string, httpOnly bool) *http.Cookie {
	c := &http.Cookie{
		Name:    url.QueryEscape(k),
		Value:   "",
		Path:    "/",
		Expires: time.Unix(0, 0),

		HttpOnly: true,
	}
	return c
}
