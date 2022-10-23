/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"database/sql"
	"net/http"

	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appUserManager"
	"qing/a/appcom"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/lib/randlib"
	"qing/r/authp"
	"qing/r/rcom"
	"qing/sod/authSod"

	"github.com/go-chi/chi/v5"
	"github.com/mgenware/goutil/jsonx"
)

func newUserInfoResult(d *da.UserAGSelectSessionDataResult) *authSod.User {
	if d == nil {
		return nil
	}
	res := rcom.CreateAuthUser(d.ID, d.Name, d.IconName)
	res.Admin = d.Admin
	return &res
}

func getUIDFromRequest(r *http.Request) uint64 {
	params := app.ContextDict(r)
	val := jsonx.GetString(params, "uid")
	if val != "" {
		uid, err := clib.DecodeID(val)
		app.PanicOn(err)
		return uid
	}

	uid := clib.MustGetUint64FromDict(params, "uid_i")
	return uid
}

func signInCore(uid uint64, w http.ResponseWriter, r *http.Request) error {
	return appUserManager.Get().Login(uid, w, r)
}

func signInHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	uid := getUIDFromRequest(r)
	err := signInCore(uid, w, r)
	app.PanicOn(err)
	return resp.MustComplete(nil)
}

func signInGETHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	uid, err := clib.DecodeID(chi.URLParam(r, "uid"))
	app.PanicOn(err)
	err = signInCore(uid, w, r)
	app.PanicOn(err)

	return resp.MustCompleteWithContent("Success", w)
}

func signOutGETHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	app.PanicOn(err)

	return resp.MustCompleteWithContent("Success", w)
}

func accVerifiedGETHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	return authp.RenderAccountVerified("en", "", w, r)
}

func newUserHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	params := app.ContextDict(r)
	lang := jsonx.GetString(params, "lang")
	regLang := jsonx.GetString(params, "regLang")
	if regLang == "" {
		regLang = "en"
	}

	resp := app.JSONResponse(w, r)
	email := randlib.RandString(16)
	db := appDB.DB()
	uid, err := da.User.TestAddUser(db, email+"@t.com", "T", regLang)
	app.PanicOn(err)

	if lang != "" {
		err = da.User.UpdateLang(db, uid, lang)
		app.PanicOn(err)
	}

	return resp.MustComplete(getDBUserInfo(uid))
}

func deleteUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := getUIDFromRequest(r)

	db := appDB.DB()
	da.UserPwd.TestDelete(db, uid)
	da.UserAuth.TestDelete(db, uid)
	da.UserStats.TestDelete(db, uid)
	da.User.TestDelete(db, uid)
	return resp.MustComplete(nil)
}

func getDBUserInfo(uid uint64) *authSod.User {
	us, err := da.User.SelectSessionData(appDB.DB(), uid)
	if err == sql.ErrNoRows {
		return newUserInfoResult(nil)
	}
	app.PanicOn(err)
	return newUserInfoResult(&us)
}

func fetchUserInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	return resp.MustComplete(getDBUserInfo(uid))
}

func currentUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	uid := appcom.ContextUserID(r.Context())
	return resp.MustComplete(clib.EncodeID(uid))
}
