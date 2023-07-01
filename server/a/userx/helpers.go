/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package userx

import (
	"net/http"
	"qing/a/def"
	"qing/lib/httplib"
)

func newSessionCookie(sid string) *http.Cookie {
	return httplib.NewCookie(def.SessionCookieKey, sid, true)
}

func newDeletedSessionCookie(sid string) *http.Cookie {
	return httplib.DeleteCookie(def.SessionCookieKey, true)
}
