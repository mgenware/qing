/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package authp

import (
	"fmt"
	"net/http"
	"qing/a/appHandler"
	"qing/a/appService"
	"qing/a/appcm"
	"qing/a/handler"

	"github.com/go-chi/chi/v5"
)

// This is the second step of password recovery, where the user enters new password.
// When this page is loaded, the server will add another entry to memory store
// to give the user
func resetPwdPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	key := chi.URLParam(r, "key")
	if key == "" {
		panic(fmt.Errorf("empty input"))
	}

	lang := appcm.ContextLanguage(r.Context())
	ls := appHandler.MainPage().Dictionary(lang)

	// Don't remove the entry from memory store, because the user may refresh the page.
	// The entry will be removed when the user successfully resets the password.
	uidStr, err := appService.Get().ForgotPwdVerifier.Peak(key)
	appcm.PanicOn(err)

	if uidStr == "" {
		// Expired or not found.
		resp := appHandler.HTMLResponse(w, r)
		return resp.MustFailf(ls.LinkExpired, http.StatusServiceUnavailable)
	}

	return defaultPage(w, r)
}
