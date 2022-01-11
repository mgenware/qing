/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"

	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/appUserManager"
	"qing/a/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/lib/randlib"
	"qing/lib/validator"
	"qing/sod/dev/auth/tUserInfo"

	"github.com/go-chi/chi/v5"
	"github.com/mgenware/goutil/jsonx"
)

const uidMaxLength = 500

type UserInfo struct {
	Admin    bool   `json:"admin,omitempty"`
	IconName string `json:"iconName,omitempty"`
	ID       string `json:"id,omitempty"`
	Name     string `json:"name,omitempty"`
}

func newUserInfoResult(d *da.UserTableSelectSessionDataResult) tUserInfo.TUserInfo {
	return tUserInfo.NewTUserInfo(
		d.Admin, fmtx.EncodeID(d.ID), appURL.Get().UserIconURL50(d.ID, d.IconName), appURL.Get().UserProfile(d.ID), d.Name,
	)
}

func getUIDFromRequest(r *http.Request) uint64 {
	params := app.ContextDict(r)
	val := jsonx.GetStringOrDefault(params, "uid")
	if val != "" {
		uid, err := fmtx.DecodeID(val)
		app.PanicIfErr(err)
		return uid
	}

	uid := validator.MustGetUint64FromDict(params, "uid_i")
	return uid
}

func signInCore(uid uint64, w http.ResponseWriter, r *http.Request) error {
	return appUserManager.Get().Login(uid, w, r)
}

func signInHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	uid := getUIDFromRequest(r)
	err := signInCore(uid, w, r)
	app.PanicIfErr(err)

	return resp.MustComplete(nil)
}

func signInGETHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	uid, err := fmtx.DecodeID(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)
	err = signInCore(uid, w, r)
	app.PanicIfErr(err)

	return resp.MustCompleteWithContent("Success", w)
}

func signOutGETHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	app.PanicIfErr(err)

	return resp.MustCompleteWithContent("Success", w)
}

func newUserHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	email := randlib.RandString(16)
	db := appDB.DB()
	uid, err := da.User.TestAddUser(db, email+"@t.com", "T")
	app.PanicIfErr(err)
	return resp.MustComplete(getDBUserInfo(uid))
}

func deleteUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)

	db := appDB.DB()
	// Try selecting the user before deleting it.
	// It will panic if not exists.
	_, err := da.User.SelectSessionData(db, uid)
	app.PanicIfErr(err)
	err = da.User.TestEraseUser(db, uid)
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}

func getDBUserInfo(uid uint64) tUserInfo.TUserInfo {
	us, err := da.User.SelectSessionData(appDB.DB(), uid)
	app.PanicIfErr(err)
	return newUserInfoResult(&us)
}

func fetchUserInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	return resp.MustComplete(getDBUserInfo(uid))
}
