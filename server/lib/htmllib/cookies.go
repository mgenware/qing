/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package htmllib

import (
	"net/http"
	"net/url"
	"qing/a/def"
	"time"
)

func NewCookie(k, v string) *http.Cookie {
	return &http.Cookie{Name: url.QueryEscape(k), Value: url.QueryEscape(v), Path: "/", Expires: time.Now().Add(def.CookiesDefaultExpiry)}
}

func DeleteCookie(k string) *http.Cookie {
	c := NewCookie(k, "")
	c.Expires = time.Now().AddDate(-1, -1, -1)
	return c
}
