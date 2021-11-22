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

	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appUserManager"
	"qing/app/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/lib/randlib"
	"qing/lib/validator"

	"github.com/mgenware/goutil/strconvx"
)

const uidParam = "uid"
const uidMaxLength = 500

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
	params := app.ContextDict(r)
	val := validator.MustGetStringFromDict(params, uidParam, uidMaxLength)

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

func signInHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)

	uid := getUIDFromUIDString(r)
	err := appUserManager.Get().Login(uid, w, r)
	app.PanicIfErr(err)

	return resp.MustComplete(nil)
}

func newUserHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	email := randlib.RandString(16)
	db := appDB.DB()
	uid, err := da.User.TestAddUser(db, email+"@t.com", "T")
	app.PanicIfErr(err)
	eid := fmtx.EncodeID(uid)
	return resp.MustComplete(eid)
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

func fetchUserInfo(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid := getUIDFromUIDString(r)
	us, err := da.User.SelectSessionData(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustComplete(us)
}
