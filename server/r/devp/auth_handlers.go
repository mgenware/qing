/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"
	"strings"

	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appUserManager"
	"qing/app/handler"
	"qing/da"
	"qing/lib/randlib"
	"qing/lib/validator"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v6/strconvx"
)

func signInHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	val := chi.URLParam(r, "uid")

	var uid uint64
	var err error
	if strings.HasPrefix(val, "-") {
		uid, err = validator.DecodeID(strings.TrimLeft(val, "-"))
		app.PanicIfErr(err)
	} else {
		uid, err = strconvx.ParseUint64(val)
		app.PanicIfErr(err)
	}

	err = appUserManager.Get().Login(uid, w, r)
	app.PanicIfErr(err)

	return resp.MustCompleteWithContent("<p>We have signed in.</p>", w)
}

func signOutHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	app.PanicIfErr(err)

	return resp.MustCompleteWithContent("<p>We have signed out.</p>", w)
}

func newUserHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	email := randlib.RandString(16)
	db := appDB.DB()
	uid, err := da.User.TestAddUser(db, email+"@t.com", "T")
	app.PanicIfErr(err)
	us, err := da.User.SelectSessionData(db, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(us)
}

func deleteUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid, err := validator.DecodeID(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)
	err = da.User.TestEraseUser(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}

func fetchUserInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid, err := validator.DecodeID(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)
	us, err := da.User.SelectSessionData(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustComplete(us)
}
