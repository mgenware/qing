/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package captchaapi

import (
	"net/http"
	"qing/app"

	"github.com/mgenware/go-packagex/v5/httpx"
	"github.com/mgenware/go-packagex/v5/strconvx"
)

// ReqCaptcha handles captcha requests.
func ReqCaptcha(w http.ResponseWriter, r *http.Request) {
	entityType, err := strconvx.ParseInt(r.FormValue("entityType"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if !app.Service.Captcha.IsTypeAllowed(entityType) {
		http.Error(w, "Invalid bid", http.StatusBadRequest)
		return
	}

	uid := app.ContextUserID(r)
	if uid == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	httpx.SetResponseContentType(w, httpx.MIMETypePNG)

	err = app.Service.Captcha.WriteCaptcha(uid, entityType, 5, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
