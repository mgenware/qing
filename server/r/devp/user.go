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

	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appUserManager"
	"qing/a/appcm"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/rcom"
	"qing/sod/authSod"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
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
	params := appcm.ContextDict(r.Context())
	val := jsonx.GetStringOrDefault(params, "uid")
	if val != "" {
		uid, err := clib.DecodeID(val)
		appcm.PanicOn(err)
		return uid
	}

	uid := clib.MustGetUint64FromDict(params, "uid_i")
	return uid
}

func signInCore(uid uint64, w http.ResponseWriter, r *http.Request) error {
	return appUserManager.Get().Login(uid, w, r)
}

func signInHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	uid := getUIDFromRequest(r)
	err := signInCore(uid, w, r)
	appcm.PanicOn(err)
	return resp.MustComplete(nil)
}

func signInGETHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	uid, err := clib.DecodeID(chi.URLParam(r, "uid"))
	appcm.PanicOn(err)
	err = signInCore(uid, w, r)
	appcm.PanicOn(err)

	return resp.MustCompleteWithContent("Success", w)
}

func signOutGETHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	appcm.PanicOn(err)

	return resp.MustCompleteWithContent("Success", w)
}

type DevNewUser struct {
	authSod.User

	Email string `json:"email,omitempty"`
}

func newUserHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	params := appcm.ContextDict(r.Context())
	lang := jsonx.GetStringOrDefault(params, "lang")
	regLang := jsonx.GetStringOrDefault(params, "regLang")
	if regLang == "" {
		regLang = "en"
	}

	resp := appHandler.JSONResponse(w, r)
	idObj, err := uuid.NewRandom()
	appcm.PanicOn(err)

	email := "zzzSV-" + idObj.String() + "@mgenware.com"
	db := appDB.DB()
	uid, err := da.User.TestAddUser(db, email, "T", regLang)
	appcm.PanicOn(err)

	if lang != "" {
		err = da.User.UpdateLang(db, uid, lang)
		appcm.PanicOn(err)
	}

	data := DevNewUser{}
	sodUser := getDBUserInfo(uid)
	data.User = *sodUser
	data.Email = email
	return resp.MustComplete(data)
}

func deleteUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
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
	appcm.PanicOn(err)
	return newUserInfoResult(&us)
}

func fetchUserInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	return resp.MustComplete(getDBUserInfo(uid))
}

func currentUser(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := appcm.ContextUserID(r.Context())
	return resp.MustComplete(clib.EncodeID(uid))
}

func userEmail(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	email, err := da.User.SelectEmail(appDB.Get().DB(), uid)
	appcm.PanicOn(err)
	return resp.MustComplete(email)
}
