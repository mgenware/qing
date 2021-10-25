/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"encoding/json"
	"net/http"
	"strings"
	"text/template"

	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appUserManager"
	"qing/app/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/lib/randlib"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v6/strconvx"
	"github.com/mgenware/go-packagex/v6/templatex"
)

var outTemplate *template.Template

func init() {
	var err error
	outTemplate, err = template.New("test").Parse("<p>{{html .}}</p>")
	if err != nil {
		panic(err)
	}
}

type UserInfo struct {
	da.UserTableSelectSessionDataResult
	EID string
}

func userInfoString(d *da.UserTableSelectSessionDataResult) string {
	r := UserInfo{UserTableSelectSessionDataResult: *d}
	r.EID = fmtx.EncodeID(d.ID)

	bytes, err := json.Marshal(r)
	if err != nil {
		panic(err)
	}
	return string(bytes)
}

func getUIDFromUIDString(r *http.Request) uint64 {
	val := chi.URLParam(r, uidStrParam)
	var uid uint64
	var err error
	if strings.HasPrefix(val, "-") {
		uid, err = fmtx.DecodeID(strings.TrimLeft(val, "-"))
		app.PanicIfErr(err)
	} else {
		uid, err = strconvx.ParseUint64(val)
		app.PanicIfErr(err)
	}
	return uid
}

func signInHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	uid := getUIDFromUIDString(r)
	err := appUserManager.Get().Login(uid, w, r)
	app.PanicIfErr(err)

	return resp.MustCompleteWithContent(templatex.MustExecuteToString(outTemplate, "The specified user has successfully signed in."), w)
}

func signOutHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	app.PanicIfErr(err)

	return resp.MustCompleteWithContent(templatex.MustExecuteToString(outTemplate, "The specified user has successfully signed out."), w)
}

func newUserHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	email := randlib.RandString(16)
	db := appDB.DB()
	uid, err := da.User.TestAddUser(db, email+"@t.com", "T")
	app.PanicIfErr(err)
	us, err := da.User.SelectSessionData(db, uid)
	app.PanicIfErr(err)
	return resp.MustCompleteWithContent(templatex.MustExecuteToString(outTemplate, "User created. "+userInfoString(&us)), w)
}

func deleteUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromUIDString(r)

	db := appDB.DB()
	// Try selecting the user before deleting it.
	// It will panic if not exists.
	_, err := da.User.SelectSessionData(db, uid)
	app.PanicIfErr(err)
	err = da.User.TestEraseUser(db, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}

func fetchUserInfo(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	uid := getUIDFromUIDString(r)
	us, err := da.User.SelectSessionData(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustCompleteWithContent(templatex.MustExecuteToString(outTemplate, userInfoString(&us)), w)
}
