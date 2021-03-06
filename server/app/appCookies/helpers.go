/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appCookies

import (
	"net/http"
	"qing/app/defs"
	"time"
)

func NewCookie(k, v string) *http.Cookie {
	return &http.Cookie{Name: k, Value: v, Path: "/", Expires: time.Now().Add(time.Second * defs.CookiesExpirySecs)}
}

func DeleteCookie(k string) *http.Cookie {
	c := NewCookie(k, "")
	c.Expires = time.Now().AddDate(-1, -1, -1)
	return c
}
