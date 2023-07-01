/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package userx

import (
	"net/http"
	"qing/a/cfgx"
	"qing/a/def"
	"qing/lib/httplib"
)

func newSessionCookie(sid string, cc *cfgx.CoreConfig) *http.Cookie {
	return httplib.NewCookie(def.SessionCookieKey, sid, cc)
}

func newDeletedSessionCookie(sid string) *http.Cookie {
	return httplib.DeleteCookie(def.SessionCookieKey)
}
