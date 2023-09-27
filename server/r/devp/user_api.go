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
	"qing/a/appService"
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
	res := rcom.CreateAuthUser(d.ID, d.Name, d.IconName)
	res.Admin = d.Admin
	return &res
}

func getUIDFromRequest(r *http.Request) uint64 {
	params := appcm.ContextDict(r.Context())
	val := jsonx.GetStringOrDefault(params, "uid")
	if val != "" {
		uid, err := clib.DecodeID(val)
		appcm.PanicOn(err, "failed to decode uid")
		return uid
	}

	uid := clib.MustGetUint64FromDict(params, "uid_i")
	return uid
}

func signInAPICore(uid uint64, w http.ResponseWriter, r *http.Request) error {
	return appUserManager.Get().Login(uid, w, r)
}

func signInAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	uid := getUIDFromRequest(r)
	err := signInAPICore(uid, w, r)
	appcm.PanicOn(err, "failed to sign in")
	return resp.MustComplete(nil)
}

func signInPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)

	uid, err := clib.DecodeID(chi.URLParam(r, "uid"))
	appcm.PanicOn(err, "failed to decode uid")
	err = signInAPICore(uid, w, r)
	appcm.PanicOn(err, "failed to sign in")

	return resp.MustCompleteWithContent("Success", w)
}

func signOutPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := appHandler.HTMLResponse(w, r)
	err := appUserManager.Get().Logout(w, r)
	appcm.PanicOn(err, "failed to sign out")

	return resp.MustCompleteWithContent("Success", w)
}

type DevUserInfo struct {
	authSod.User

	Email string `json:"email,omitempty"`
}

func newUserAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	params := appcm.ContextDict(r.Context())
	lang := jsonx.GetStringOrDefault(params, "lang")
	regLang := jsonx.GetStringOrDefault(params, "regLang")
	pwd := jsonx.GetStringOrDefault(params, "pwd")
	priAccount := jsonx.GetBoolOrDefault(params, "priAccount")
	noNoti := jsonx.GetBoolOrDefault(params, "noNoti")
	if regLang == "" {
		regLang = "en"
	}

	resp := appHandler.JSONResponse(w, r)
	idObj, err := uuid.NewRandom()
	appcm.PanicOn(err, "failed to generate uuid")

	email := "zzzTest-" + idObj.String() + "@mgenware.com"
	db := appDB.DB()

	var uid uint64
	var pwdHash string
	userName := "T"
	if pwd != "" {
		pwdHash, err = appService.Get().HashingAlg.CreateHash(pwd)
		appcm.PanicOn(err, "failed to hash password")

		uid, err = da.UserPwd.AddPwdBasedUser(appDB.DB(), email, userName, lang, pwdHash)
		appcm.PanicOn(err, "failed to add user")
	} else {
		uid, err = da.User.TestAddUser(db, email, userName, regLang)
		appcm.PanicOn(err, "failed to add user")
	}

	if lang != "" {
		err = da.User.UpdateLang(db, uid, lang)
		appcm.PanicOn(err, "failed to update lang")
	}
	if priAccount {
		err = da.User.UpdatePriAccount(db, uid, true)
		appcm.PanicOn(err, "failed to update `pri_account`")
	}
	if noNoti {
		err = da.User.UpdateNoNoti(db, uid, true)
		appcm.PanicOn(err, "failed to update `no_noti`")
	}

	return resp.MustComplete(fetchUserInfo(uid))
}

func deleteUserAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)

	db := appDB.DB()
	da.UserPwd.TestDelete(db, uid)
	da.UserAuth.TestDelete(db, uid)
	da.UserStats.TestDelete(db, uid)
	da.User.TestDelete(db, uid)
	return resp.MustComplete(nil)
}

func fetchUserInfo(uid uint64) *DevUserInfo {
	sessionData, err := da.User.SelectSessionData(appDB.DB(), uid)
	if err == sql.ErrNoRows {
		return nil
	}
	appcm.PanicOn(err, "failed to select session data")

	email, err := da.User.SelectEmail(appDB.DB(), uid)
	appcm.PanicOn(err, "failed to select email")

	sodUser := newUserInfoResult(&sessionData)
	return &DevUserInfo{
		User:  *sodUser,
		Email: email,
	}
}

func fetchUserInfoAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	return resp.MustComplete(fetchUserInfo(uid))
}

func currentUserAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := appcm.ContextUserID(r.Context())
	return resp.MustComplete(clib.EncodeID(uid))
}

func userEmailAPI(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromRequest(r)
	email, err := da.User.SelectEmail(appDB.Get().DB(), uid)
	appcm.PanicOn(err, "failed to select email")
	return resp.MustComplete(email)
}
