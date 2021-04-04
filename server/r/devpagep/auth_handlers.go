/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devpagep

import (
	"net/http"

	"qing/app"
	"qing/app/appHandler"
	"qing/app/appUserManager"
	"qing/app/handler"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v5/strconvx"
)

func signIn(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	uid, err := strconvx.ParseUint64(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)

	user, err := appUserManager.Get().CreateUserSessionFromUID(uid)
	app.PanicIfErr(err)

	err = appUserManager.Get().SessionManager.Login(w, r, user)
	app.PanicIfErr(err)

	return resp.Redirect("/", http.StatusTemporaryRedirect)
}

func signOut(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	err := appUserManager.Get().SessionManager.Logout(w, r)
	app.PanicIfErr(err)

	return resp.Redirect("/", http.StatusTemporaryRedirect)
}
